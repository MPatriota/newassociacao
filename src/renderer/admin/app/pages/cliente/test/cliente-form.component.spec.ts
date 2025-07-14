import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteFormComponent } from '../form/cliente-form.component';
import { ClienteModule } from '../cliente.module';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { Cliente } from '../../../../../shared/model/cliente.model';
import { Endereco } from '../../../../../shared/model/endereco.model';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Dependente } from "../../../../../shared/model/dependente.model";
import { EventEmitter } from "@angular/core";
import { CepService } from "../../../../../shared/services/cep.service";
import { CepApiInformation } from "../../../../../shared/model/cep.model";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";

describe("ClienteFormComponent", () => {

  let fixture: ComponentFixture<ClienteFormComponent>;
  let component: ClienteFormComponent;
  let clienteService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let cepService: any;
  let confirmationService: any;
  let cepAPIInformation: CepApiInformation = {
    logradouro: "rua",
    bairro: "bairro",
    estado: "Paraná",
    localidade: "Maringá",
    uf: "PR"
  }

  beforeEach(async () => {
    clienteService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
    };

    cepService = {
      findByCep: jest.fn(() => of(cepAPIInformation))
    }

    confirmationService = {
      confirm: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [ClienteModule],
      providers: [
        { provide: ClienteService, useValue: clienteService },
        { provide: CepService, useValue: cepService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
        MessageService,
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    component.isVisible = true;
    fixture.detectChanges();
  })

  it('should save', () => {
    component.imageUpload.defineImage("teste");

    const endereco: Endereco = {
      id: undefined,
      cep: '12345678',
      logradouro: 'rua teste',
      numero: '69',
      bairro: 'bairro teste',
      cidade: 'Maringá',
      estado: 'PR'
    }

    const dependente: Dependente = {
      id: undefined,
      nome: 'dependente'
    }

    const cliente: Cliente = {
      id: undefined,
      nome: 'Lucas',
      endereco,
      matricula: '123456',
      limiteCompra: 13.59,
      dependentes: [dependente],
      email: 'cliente@email.com'
    }

    component.form.patchValue(cliente);

    component.dependentes.push(component.createDependenteForm()());
    component.dependentes.at(0).patchValue(dependente);

    component.isVisible = true;

    component.save();

    expect(clienteService.save).toHaveBeenCalledTimes(1);
    expect(clienteService.save).toHaveBeenCalledWith({...cliente, foto: "teste"});
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(clienteService.save).not.toHaveBeenCalled();
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
    component.stepperActiveIndex = 2;

    isVisibleChange.emit();

    expect(component.isVisible).toBeTruthy();
    expect(clienteService.findById).not.toHaveBeenCalled();
    expect(component.stepperActiveIndex).toEqual(1);
  })

  it('visible change with id', () => {
    const endereco: Endereco = {
      id: undefined,
      cep: '12345678',
      logradouro: 'rua teste',
      numero: '69',
      bairro: 'bairro teste',
      cidade: 'Maringá',
      estado: 'PR'
    }

    const dependente: Dependente = {
      id: 1,
      nome: 'dependente'
    }

    const cliente: Cliente = {
      id: 1,
      nome: 'Lucas',
      endereco,
      matricula: '123456',
      limiteCompra: 13.59,
      dependentes: [dependente],
      email: 'cliente@email.com'
    }

    clienteService.findById.mockReturnValue(of(cliente));

    component.isVisible = false;
    component.stepperActiveIndex = 2;

    isVisibleChange.emit(1);

    fixture.detectChanges();

    expect(component.isVisible).toBeTruthy();
    expect(clienteService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual({...cliente, dependentes: [{...dependente, rowId: 0}]});
    expect(component.stepperActiveIndex).toEqual(1);
  })

  it('should search for CEP informations when CEP changes', () => {
    const enderecoForm = component.form.get('endereco')!
    let cepFormControl = enderecoForm.get('cep')!;

    cepFormControl.patchValue("87047415");

    expect(cepService.findByCep).toHaveBeenCalledTimes(1);
    expect(cepService.findByCep).toHaveBeenCalledWith("87047415");

    expect(enderecoForm.value).toEqual(expect.objectContaining({
      logradouro: cepAPIInformation.logradouro,
      bairro: cepAPIInformation.bairro,
      cidade: cepAPIInformation.localidade,
      estado: cepAPIInformation.uf,
    }))
  })

})
