import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntradaEstoque } from "../../../../../shared/model/entrada-estoque.model";
import { EntradaEstoqueService } from "../../../../../shared/services/entrada-estoque.service";
import {StatementSearchModel} from '../../../../../shared/model/statement-search.model';

@Component({
  selector: 'entrada-estoque-list',
  templateUrl: "entrada-estoque-list.component.html",
  standalone: false
})
export class EntradaEstoqueListComponent implements OnInit {

  page: Page<EntradaEstoque> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search: string | StatementSearchModel = "";
  formVisibleChange = new EventEmitter<number | undefined>;

  constructor(
    private entradaEstoqueService: EntradaEstoqueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.entradaEstoqueService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(search: any) {
    this.search = {
      children: [
        {
          statement: `nome=ilike=*${search}*`,
          alias: 'produto'
        }
      ]
    };
    this.fetch();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(entradaEstoque: EntradaEstoque) {
    if(!entradaEstoque.id){
      return;
    }

    this.formVisibleChange.emit(entradaEstoque.id);
  }

  delete(entradaEstoque: EntradaEstoque) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Entrada de Estoque?`,
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
        if(!entradaEstoque.id){
          return;
        }

        this.entradaEstoqueService.delete(entradaEstoque.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entrada de Estoque excluída com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

}
