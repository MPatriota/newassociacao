import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dependente } from "../../../../../shared/model/dependente.model";
import { Popover } from "primeng/popover";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";


@Component({
  selector: 'fornecedor-list',
  templateUrl: "fornecedor-list.component.html",
  standalone: false
})
export class FornecedorListComponent implements OnInit {

  page: Page<Fornecedor> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search = "";
  formVisibleChange = new EventEmitter<number | undefined>;

  constructor(
    private fornecedorService: FornecedorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.fornecedorService.findAll(this.pageParameters.page,
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

  edit(fornecedor: Fornecedor) {
    if(!fornecedor.id){
      return;
    }

    this.formVisibleChange.emit(fornecedor.id);
  }

  delete(fornecedor: Fornecedor) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o fornecedor <b>${fornecedor.nome}</b>?`,
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
        if(!fornecedor.id){
          return;
        }

        this.fornecedorService.delete(fornecedor.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor excluído com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

}