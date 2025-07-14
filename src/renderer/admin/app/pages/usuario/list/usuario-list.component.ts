import { Component, EventEmitter, OnInit} from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Usuario } from '../../../../../shared/model/usuario.model';
import { UsuarioService } from '../../../../../shared/services/usuario.service';

@Component({
  selector: 'usuario-list',
  templateUrl: "usuario-list.component.html",
  standalone: false
})
export class UsuarioListComponent implements OnInit {

  page: Page<Usuario> | null = null;
  pageParameters: PageParameter = new PageParameter();
  search = "";
  formVisibleChange = new EventEmitter<number | undefined>;

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.usuarioService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(search: any) {
    this.search = `nome=ilike=*${search}*;usuario=ilike=*${search}*`;
    this.fetch();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(usuario: Usuario) {
    if(!usuario.id){
      return;
    }

    this.formVisibleChange.emit(usuario.id);
  }

  delete(usuario: Usuario) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o usuário <b>${usuario.nome}</b>?`,
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
        if(!usuario.id){
          return;
        }

        this.usuarioService.delete(usuario.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

}
