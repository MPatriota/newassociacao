import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import {FormArray} from '@angular/forms';
import {ContaPagar} from '../../../../../shared/model/conta-pagar.model';
import { ContaPagarFormComponent } from '../form/conta-pagar-form.component';
import { ContaPagarService } from '../../../../../shared/services/conta-pagar.service';
import { ContaPagarModule } from '../conta-pagar.module';
import { DocumentoTipo } from '../../../../../shared/enum/documento-tipo.enum';

describe("ContaPagarFormComponent", () => {

  let fixture: ComponentFixture<ContaPagarFormComponent>;
  let component: ContaPagarFormComponent;
  let contaPagarService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let contaPagar: ContaPagar;
  let fornecedorService: any;

  beforeEach(async () => {
    contaPagarService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    confirmationService = {
      confirm: jest.fn()
    }

    contaPagar = {
      id: undefined,
      valor: 10,
      fornecedor: {
        id: 1
      } as any,
      dataVencimento: new Date(2025, 4, 10),
      paga: false
    }

    fornecedorService = {
      findAll: jest.fn(() => of([]))
    }

    await TestBed.configureTestingModule({
      imports: [ContaPagarModule],
      providers: [
        { provide: ContaPagarService, useValue: contaPagarService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: FornecedorService, useValue: fornecedorService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaPagarFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(contaPagarService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const contaPagarUpdate: ContaPagar = {
      id: 1,
      valor: 15,
      fornecedor: {
        id: 2
      } as any,
      dataVencimento: new Date(2025, 4, 15),
    }

    component.form.patchValue(contaPagarUpdate);

    component.originalValue = {...contaPagar, id: 1};

    component.isVisible = true;

    component.save();

    expect(contaPagarService.update).toHaveBeenCalledTimes(1);
    // expect(contaPagarService.update).toHaveBeenCalledWith(1, []);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(contaPagar);

    component.isVisible = true;

    component.save();

    expect(contaPagarService.save).toHaveBeenCalledTimes(1);
    expect(contaPagarService.save).toHaveBeenCalledWith(contaPagar);
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
    expect(contaPagarService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    contaPagarService.findById.mockReturnValue(of(contaPagar));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(contaPagarService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual(contaPagar);
  })

  it('should search fornecedores', () => {
    const fornecedoresToReturn = {content: [{id: 1}]};

    fornecedorService.findAll = jest.fn(() => of(fornecedoresToReturn));

    component.searchFornecedores({query: 'teste'} as any);

    expect(fornecedorService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.fornecedoresSelect).toEqual(fornecedoresToReturn.content);
  })

})
