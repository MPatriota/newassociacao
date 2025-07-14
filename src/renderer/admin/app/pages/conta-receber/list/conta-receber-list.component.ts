import { Component, EventEmitter, OnInit } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import {StatementSearchModel} from '../../../../../shared/model/statement-search.model';
import { ContaReceber } from '../../../../../shared/model/conta-receber.model';
import { getOperations } from '../../../../../shared/util/json.util';
import moment from 'moment';
import { ContaReceberService } from '../../../../../shared/services/conta-receber.service';
import { ContaReceberStatus } from '../../../../../shared/enum/conta-receber-status.enum';
import { DateService } from '../../../../../shared/services/date.service';

@Component({
  selector: 'conta-receber-list',
  templateUrl: "conta-receber-list.component.html",
  standalone: false
})
export class ContaReceberListComponent implements OnInit {

  page: Page<ContaReceber> | null = null;
  pageParameters: PageParameter = new PageParameter();
  searchValue = "";
  search = this.defaultSearch();
  formVisibleChange = new EventEmitter<number | undefined>;
  advancedFilters = this.defaultAdvancedFilters;
  statusToFilter = [
    ContaReceberStatus.ABERTA,
    ContaReceberStatus.PAGA,
    ContaReceberStatus.VENCIDA
  ]

  get defaultAdvancedFilters() {
    return {
      valorInicial: { value: undefined, callback: (value: any) => `valor>=${value}`},
      valorFinal: { value: undefined, callback: (value: any) => `valor<=${value}`},
      dataVencimentoInicial: { value: "", callback: (value: any) => `dataVencimento>=${value}`},
      dataVencimentoFinal: { value: "", callback: (value: any) => `dataVencimento<=${value}`},
      status: { value: undefined, callback: (value: any) => {

          if(ContaReceberStatus.ABERTA == value) {
            return `paga==false,dataVencimento>=${this.formatDate(new Date())}`;
          }

          if (ContaReceberStatus.PAGA == value) {
            return 'paga==true';
          }

          return `paga==false,dataVencimento<${this.formatDate(new Date())}`;
        }},
    };
  }

  constructor(
    private contaReceberService: ContaReceberService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.contaReceberService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(searchValue: any) {
    this.searchValue = searchValue;
    this.applyAdvancedFilters();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(contaReceber: ContaReceber) {
    if(!contaReceber.id){
      return;
    }

    this.formVisibleChange.emit(contaReceber.id);
  }

  delete(contaReceber: ContaReceber) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Conta a Receber?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      },
      accept: () => {
        if(!contaReceber.id){
          return;
        }

        this.contaReceberService.delete(contaReceber.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Receber excluída com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

  confirmarBaixa(contaReceber: ContaReceber) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja dar baixa nessa Conta a Receber?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'danger',
      },
      accept: () => this.realizarBaixa(contaReceber)
    });
  }

  private realizarBaixa(contaReceber: ContaReceber) {
    if(!contaReceber.id){
      return;
    }

    const operations = getOperations(contaReceber, {...contaReceber, paga: true, dataPagamento: this.dateService.getCurrentDate()});

    this.contaReceberService.update(contaReceber.id, operations).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Baixa realizada com sucesso.' });
      this.fetch();
    });
  }

  clearFilters() {
    this.advancedFilters = this.defaultAdvancedFilters;
    this.applyAdvancedFilters();
  }

  applyAdvancedFilters() {

    let defaultSearch = this.defaultSearch();

    const advancedFilters: string[] = [];

    Object.keys(this.advancedFilters).forEach((key: any) => {

      // @ts-ignore
      const filter: any = this.advancedFilters[key];

      if (typeof filter.value == 'number' || filter.value?.length > 0) {
        advancedFilters.push(filter.callback(filter.value));
      }

    });

    defaultSearch.statement = advancedFilters.join(',');

    this.search = defaultSearch;
    this.loadData(new PageParameter());
  }

  private defaultSearch(): StatementSearchModel {
    return {
      statement: "",
      children: [
        {
          statement: `nome=ilike=*${this.searchValue}*`,
          alias: 'cliente'
        }
      ]
    }
  }

  formatDate(date: Date) {
    if(!date) {
      return '';
    }

    return moment(date).format('YYYY-MM-DD');
  }

}
