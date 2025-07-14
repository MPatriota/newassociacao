import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioFormComponent } from '../form/usuario-form.component';
import { UsuarioModule } from '../usuario.module';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { UsuarioService } from '../../../../../shared/services/usuario.service';
import { Usuario } from '../../../../../shared/model/usuario.model';
import { Fornecedor } from '../../../../../shared/model/fornecedor.model';
import { DocumentoTipo } from '../../../../../shared/enum/documento-tipo.enum';

describe("UsuarioFormComponent", () => {

  let fixture: ComponentFixture<UsuarioFormComponent>;
  let component: UsuarioFormComponent;
  let usuarioService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;

  beforeEach(async () => {
    usuarioService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({})),
    };

    confirmationService = {
      confirm: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [UsuarioModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
        MessageService,
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    component.isVisible = true;
    fixture.detectChanges();
  })

  it('should save', () => {
    const usuario: Usuario = {
      id: undefined,
      nome: 'Lucas',
      usuario: 'usuario',
      senha: 'teste',
      primeiroAcessoRealizado: false,
    }

    component.form.patchValue(usuario);

    component.isVisible = true;

    component.save();

    expect(usuarioService.save).toHaveBeenCalledTimes(1);
    expect(usuarioService.save).toHaveBeenCalledWith(usuario);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(usuarioService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const usuarioUpdate: Usuario = {
      id: 1,
      nome: 'Lucas 2',
      usuario: 'usuario',
      senha: 'teste',
      primeiroAcessoRealizado: false
    }

    component.form.patchValue(usuarioUpdate);

    component.originalValue = {
      id: 1,
      nome: 'Lucas',
      usuario: 'usuario2',
      senha: 'teste123',
      primeiroAcessoRealizado: false
    };

    component.isVisible = true;

    component.save();

    expect(usuarioService.update).toHaveBeenCalledTimes(1);
    expect(usuarioService.update).toHaveBeenCalledWith(1, [
        { op: 'replace', path: '/senha', value: 'teste' },
        { op: 'replace', path: '/usuario', value: 'usuario' },
        { op: 'replace', path: '/nome', value: 'Lucas 2' }
      ]
    );
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should close dirty form', () => {
    component.isVisible = true;
    component.form.markAsDirty();

    component.closeForm();

    let [callArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    expect(callArgument).toEqual(expect.objectContaining(
      {
        header: 'Confirmação',
        message: 'Há dados não salvos pendentes, tem certeza que deseja cancelar?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Sim',
          severity: 'danger',
        }
      }
    ))
    expect(component.isVisible).toBeTruthy();

    callArgument.accept!();

    expect(component.isVisible).toBeFalsy();
  })

  it('should close not dirty form', () => {
    component.isVisible = true;

    component.closeForm();

    expect(confirmationService.confirm).not.toHaveBeenCalled();
    expect(component.isVisible).toBeFalsy();
  })

  it('visible change without id', () => {
    component.isVisible = false;

    isVisibleChange.emit();

    expect(component.isVisible).toBeTruthy();
    expect(usuarioService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    const usuario: Usuario = {
      id: 1,
      nome: 'Lucas',
      usuario: 'usuario',
      senha: "teste",
      primeiroAcessoRealizado: false
    }

    usuarioService.findById.mockReturnValue(of(usuario));

    component.isVisible = false;

    isVisibleChange.emit(1);

    fixture.detectChanges();

    expect(component.isVisible).toBeTruthy();
    expect(usuarioService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual(usuario);
  })

})
