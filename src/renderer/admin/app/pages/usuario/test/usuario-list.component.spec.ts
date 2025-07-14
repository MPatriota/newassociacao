import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioModule } from '../usuario.module';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UsuarioListComponent } from "../list/usuario-list.component";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { PageParameter } from "../../../../../shared/model/page-parameter";
import { UsuarioService } from '../../../../../shared/services/usuario.service';
import { Usuario } from '../../../../../shared/model/usuario.model';

describe("UsuarioListComponent", () => {

  let fixture: ComponentFixture<UsuarioListComponent>;
  let component: UsuarioListComponent;
  let usuarioService: any;
  let messageService: any;
  let confirmationService: any;
  let usuario: Usuario;

  beforeEach(async () => {
    usuarioService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn()

    usuario = {
      id: 1,
      nome: 'Lucas',
      usuario: 'usuario',
      primeiroAcessoRealizado: true
    }

    await TestBed.configureTestingModule({
      imports: [UsuarioModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(usuarioService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    usuarioService.findAll.mockClear();

    component.onSearch('teste');

    expect(usuarioService.findAll).toHaveBeenCalledTimes(1);
    expect(usuarioService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*;usuario=ilike=*teste*');
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(usuario);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(usuario.id);
  })

  it('should fetch when close form', () => {
    usuarioService.findAll.mockClear();

    component.onSave();

    expect(usuarioService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete usuario', () => {
    component.delete(usuario);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
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
      }
    }))

    let [confirmationCallArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    confirmationCallArgument.accept!();

    expect(usuarioService.delete).toHaveBeenCalledTimes(1);
    expect(usuarioService.delete).toHaveBeenCalledWith(usuario.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso.' });
  })
})
