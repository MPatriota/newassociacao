import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../model/page.model';
import { PageParameter } from '../../../model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SaidaEstoque } from "../../../model/saida-estoque.model";
import {SaidaEstoqueService} from '../../../services/saida-estoque.service';
import {StatementSearchModel} from '../../../model/statement-search.model';

@Component({
  selector: 'saida-estoque-list',
  templateUrl: "saida-estoque-list.component.html",
  standalone: false
})
export class SaidaEstoqueListComponent implements OnInit {

  page: Page<SaidaEstoque> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search: string | StatementSearchModel = "";
  formVisibleChange = new EventEmitter<number | undefined>;

  constructor(
    private saidaEstoqueService: SaidaEstoqueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.saidaEstoqueService.findAll(this.pageParameters.page,
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

  edit(saidaEstoque: SaidaEstoque) {
    if(!saidaEstoque.id){
      return;
    }

    this.formVisibleChange.emit(saidaEstoque.id);
  }

  delete(saidaEstoque: SaidaEstoque) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Saída de Estoque?`,
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
        if(!saidaEstoque.id){
          return;
        }

        this.saidaEstoqueService.delete(saidaEstoque.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Saída de Estoque excluída com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

}
