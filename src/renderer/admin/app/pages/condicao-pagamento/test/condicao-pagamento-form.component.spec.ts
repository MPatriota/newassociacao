import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CondicaoPagamentoFormComponent } from '../form/condicao-pagamento-form.component';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";
import { CondicaoPagamentoModule } from "../condicao-pagamento.module";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";

describe("CondicaoPagamentoFormComponent", () => {

  let fixture: ComponentFixture<CondicaoPagamentoFormComponent>;
  let component: CondicaoPagamentoFormComponent;
  let condicaoPagamentoService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let condicaoPagamento: CondicaoPagamento;

  beforeEach(async () => {
    condicaoPagamentoService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    confirmationService = {
      confirm: jest.fn()
    }

    condicaoPagamento = {
      id: undefined,
      nome: 'Lucas',
      parcelas: 1,
      intervalo: 2,
      vencimento: 3,
      descricao: 'descricao',
      ativa: true,
      obrigadoInformarCliente: false,
      aVista: false
    }

    await TestBed.configureTestingModule({
      imports: [CondicaoPagamentoModule],
      providers: [
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicaoPagamentoFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(condicaoPagamentoService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const condicaoPagamentoUpdate: CondicaoPagamento = {
      id: 1,
      nome: 'Lucas 2',
      parcelas: 2,
      intervalo: 3,
      vencimento: 4,
      descricao: 'descricao 2',
      ativa: false
    }

    component.form.patchValue(condicaoPagamentoUpdate);

    component.originalValue = {...condicaoPagamento, id: 1};

    component.isVisible = true;

    component.save();

    expect(condicaoPagamentoService.update).toHaveBeenCalledTimes(1);
    expect(condicaoPagamentoService.update).toHaveBeenCalledWith(1, [
      { op: 'replace', path: '/ativa', value: false },
      { op: 'replace', path: '/descricao', value: 'descricao 2' },
      { op: 'replace', path: '/vencimento', value: 4 },
      { op: 'replace', path: '/intervalo', value: 3 },
      { op: 'replace', path: '/parcelas', value: 2 },
      { op: 'replace', path: '/nome', value: 'Lucas 2' }
    ]);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(condicaoPagamento);

    component.isVisible = true;

    component.save();

    expect(condicaoPagamentoService.save).toHaveBeenCalledTimes(1);
    expect(condicaoPagamentoService.save).toHaveBeenCalledWith(condicaoPagamento);
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
    expect(condicaoPagamentoService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    condicaoPagamentoService.findById.mockReturnValue(of(condicaoPagamento));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(condicaoPagamentoService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual({...condicaoPagamento});
  })

})
