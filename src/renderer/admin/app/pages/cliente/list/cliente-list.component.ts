import { Component, EventEmitter, isStandalone, OnInit, signal, ViewChild } from '@angular/core';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { Router } from '@angular/router';
import { Page } from '../../../../../shared/model/page.model';
import { Cliente } from '../../../../../shared/model/cliente.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dependente } from "../../../../../shared/model/dependente.model";
import { Popover } from "primeng/popover";


@Component({
  selector: 'cliente-list',
  templateUrl: "cliente-list.component.html",
  standalone: false
})
export class ClienteListComponent implements OnInit {

  page: Page<Cliente> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search = "";
  formVisibleChange = new EventEmitter<number | undefined>;
  dependentesToShow: Dependente[] = []
  @ViewChild('op') dependentesPopover!: Popover;

  constructor(
    private clienteService: ClienteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.clienteService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(search: any) {
    this.search = `nome=ilike=*${search}*;matricula=ilike=*${search}*`;
    this.fetch();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(cliente: Cliente) {
    if(!cliente.id){
      return;
    }

    this.formVisibleChange.emit(cliente.id);
  }

  delete(cliente: Cliente) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o cliente <b>${cliente.nome}</b>?`,
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
        if(!cliente.id){
          return;
        }

        this.clienteService.delete(cliente.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

  showDependentes(cliente: Cliente, event: MouseEvent) {
    if(!cliente.dependentes.length){
      return
    }

    this.dependentesToShow = cliente.dependentes;
    this.dependentesPopover.toggle(event);
  }

}