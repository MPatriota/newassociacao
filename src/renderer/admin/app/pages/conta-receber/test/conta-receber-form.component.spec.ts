import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { ClienteService } from "../../../../../shared/services/cliente.service";
import { ContaReceber } from '../../../../../shared/model/conta-receber.model';
import { ContaReceberFormComponent } from '../form/conta-receber-form.component';
import { ContaReceberModule } from '../conta-receber.module';
import { ContaReceberService } from '../../../../../shared/services/conta-receber.service';

describe("ContaReceberFormComponent", () => {

  let fixture: ComponentFixture<ContaReceberFormComponent>;
  let component: ContaReceberFormComponent;
  let contaReceberService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let contaReceber: ContaReceber;
  let clienteService: any;

  beforeEach(async () => {
    contaReceberService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    confirmationService = {
      confirm: jest.fn()
    }

    contaReceber = {
      id: undefined,
      valor: 10,
      cliente: {
        id: 1
      } as any,
      dataVencimento: new Date(2025, 4, 10),
      paga: false,
      descricao: ""
    }

    clienteService = {
      findAll: jest.fn(() => of([]))
    }

    await TestBed.configureTestingModule({
      imports: [ContaReceberModule],
      providers: [
        { provide: ContaReceberService, useValue: contaReceberService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ClienteService, useValue: clienteService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaReceberFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(contaReceberService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const contaReceberUpdate: ContaReceber = {
      id: 1,
      valor: 15,
      cliente: {
        id: 2
      } as any,
      dataVencimento: new Date(2025, 4, 15),
      descricao: ""
    }

    component.form.patchValue(contaReceberUpdate);

    component.originalValue = {...contaReceber, id: 1};

    component.isVisible = true;

    component.save();

    expect(contaReceberService.update).toHaveBeenCalledTimes(1);
    // expect(contaReceberService.update).toHaveBeenCalledWith(1, []);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(contaReceber);

    component.isVisible = true;

    component.save();

    expect(contaReceberService.save).toHaveBeenCalledTimes(1);
    expect(contaReceberService.save).toHaveBeenCalledWith(contaReceber);
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
    expect(contaReceberService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    contaReceberService.findById.mockReturnValue(of(contaReceber));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(contaReceberService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual(contaReceber);
  })

  it('should search clientes', () => {
    const clientesToReturn = {content: [{id: 1}]};

    clienteService.findAll = jest.fn(() => of(clientesToReturn));

    component.searchClientes({query: 'teste'} as any);

    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.clientesSelect).toEqual(clientesToReturn.content);
  })

})
