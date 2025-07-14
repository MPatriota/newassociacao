import { Component, EventEmitter, OnInit } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import {StatementSearchModel} from '../../../../../shared/model/statement-search.model';
import { ContaPagar } from '../../../../../shared/model/conta-pagar.model';
import { ContaPagarService } from '../../../../../shared/services/conta-pagar.service';
import { getOperations } from '../../../../../shared/util/json.util';
import { FilterState } from '../../../../../shared/model/filter.state';
import moment from 'moment';
import { ContaPagarStatus } from '../../../../../shared/enum/conta-pagar-status.enum';
import { DateService } from '../../../../../shared/services/date.service';

@Component({
  selector: 'conta-pagar-list',
  templateUrl: "conta-pagar-list.component.html",
  standalone: false
})
export class ContaPagarListComponent implements OnInit {

  page: Page<ContaPagar> | null = null;
  pageParameters: PageParameter = new PageParameter();
  searchValue = "";
  search = this.defaultSearch();
  formVisibleChange = new EventEmitter<number | undefined>;
  advancedFilters = this.defaultAdvancedFilters;
  statusToFilter = [
    ContaPagarStatus.ABERTA,
    ContaPagarStatus.PAGA,
    ContaPagarStatus.VENCIDA
  ]

  get defaultAdvancedFilters() {
    return {
      valorInicial: { value: undefined, callback: (value: any) => `valor>=${value}`},
      valorFinal: { value: undefined, callback: (value: any) => `valor<=${value}`},
      dataVencimentoInicial: { value: "", callback: (value: any) => `dataVencimento>=${value}`},
      dataVencimentoFinal: { value: "", callback: (value: any) => `dataVencimento<=${value}`},
      status: { value: undefined, callback: (value: any) => {

        if(ContaPagarStatus.ABERTA == value) {
          return `paga==false,dataVencimento>=${this.formatDate(new Date())}`;
        }

        if (ContaPagarStatus.PAGA == value) {
          return 'paga==true';
        }

        return `paga==false,dataVencimento<${this.formatDate(new Date())}`;
      }},
    };
  }

  constructor(
    private contaPagarService: ContaPagarService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dateService: DateService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.contaPagarService.findAll(this.pageParameters.page,
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

  edit(contaPagar: ContaPagar) {
    if(!contaPagar.id){
      return;
    }

    this.formVisibleChange.emit(contaPagar.id);
  }

  delete(contaPagar: ContaPagar) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Conta a Pagar?`,
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
        if(!contaPagar.id){
          return;
        }

        this.contaPagarService.delete(contaPagar.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Pagar excluída com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

  confirmarBaixa(contaPagar: ContaPagar) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja dar baixa nessa Conta a Pagar?`,
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
      accept: () => this.realizarBaixa(contaPagar)
    });
  }

  private realizarBaixa(contaPagar: ContaPagar) {
    if(!contaPagar.id){
      return;
    }

    const operations = getOperations(contaPagar, {...contaPagar, paga: true, dataPagamento: this.dateService.getCurrentDate()});

    this.contaPagarService.update(contaPagar.id, operations).subscribe(() => {
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
          alias: 'fornecedor'
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
