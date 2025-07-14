import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";

@Component({
  selector: 'condicao-pagamento-list',
  templateUrl: "condicao-pagamento-list.component.html",
  standalone: false
})
export class CondicaoPagamentoListComponent implements OnInit {

  page: Page<CondicaoPagamento> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search = "";
  formVisibleChange = new EventEmitter<number | undefined>;

  constructor(
    private condicaoPagamentoService: CondicaoPagamentoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.condicaoPagamentoService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(search: any) {
    this.search = `nome=ilike=*${search}*;documento=ilike=*${search}*`;
    this.fetch();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(condicaoPagamento: CondicaoPagamento) {
    if(!condicaoPagamento.id){
      return;
    }

    this.formVisibleChange.emit(condicaoPagamento.id);
  }

  delete(condicaoPagamento: CondicaoPagamento) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Condição de Pagamento <b>${condicaoPagamento.nome}</b>?`,
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
        if(!condicaoPagamento.id){
          return;
        }

        this.condicaoPagamentoService.delete(condicaoPagamento.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição de Pagamento excluída com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

}