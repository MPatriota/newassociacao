import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { ClienteService } from "../../../../../shared/services/cliente.service";
import { AgendamentoQuiosqueFormComponent } from '../form/agendamento-quiosque-form.component';
import { AgendamentoQuiosqueModule } from '../agendamento-quiosque.module';
import { AgendamentoQuiosque } from '../../../../../shared/model/agendamento-quiosque.model';
import { AgendamentoQuiosqueService } from '../../../../../shared/services/agendamento-quiosque.service';
import { QuiosqueService } from '../../../../../shared/services/quiosque.service';
import { DateService } from '../../../../../shared/services/date.service';

describe("AgendamentoQuiosqueFormComponent", () => {

  let fixture: ComponentFixture<AgendamentoQuiosqueFormComponent>;
  let component: AgendamentoQuiosqueFormComponent;
  let agendamentoQuiosqueService: any;
  let quiosqueService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let agendamentoQuiosque: AgendamentoQuiosque;
  let clienteService: any;
  let dateService: any;

  beforeEach(async () => {
    agendamentoQuiosqueService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    confirmationService = {
      confirm: jest.fn()
    }

    agendamentoQuiosque = {
      id: undefined,
      valor: 10,
      cliente: {
        id: 1
      } as any,
      data: new Date(2099, 4, 10),
      quiosque: {
        id: 2,
        valorAluguel: 10
      } as any,
      horaInicio: "12:00",
      horaFim: "14:00",
      descricao: "",
      contasReceber: []
    }

    clienteService = {
      findAll: jest.fn(() => of([]))
    }

    quiosqueService = {
      findAll: jest.fn(() => of({content: []}))
    }

    dateService = {
      getCurrentDate: jest.fn(() => new Date(2025, 4, 11)),
    }

    await TestBed.configureTestingModule({
      imports: [AgendamentoQuiosqueModule],
      providers: [
        { provide: AgendamentoQuiosqueService, useValue: agendamentoQuiosqueService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ClienteService, useValue: clienteService },
        { provide: QuiosqueService, useValue: quiosqueService },
        { provide: DateService, useValue: dateService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamentoQuiosqueFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(agendamentoQuiosqueService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const agendamentoQuiosqueUpdate: AgendamentoQuiosque = {
      id: 1,
      valor: 15,
      cliente: {
        id: 2
      } as any,
      data: new Date(2025, 4, 15),
      quiosque: {
        id: 3,
        valorAluguel: 15
      } as any,
      horaInicio: "13:00",
      horaFim: "15:00",
      descricao: "",
      contasReceber: []
    }

    component.form.patchValue(agendamentoQuiosqueUpdate);

    component.originalValue = {...agendamentoQuiosque, id: 1};

    component.isVisible = true;

    component.save();

    expect(agendamentoQuiosqueService.update).toHaveBeenCalledTimes(1);
    // expect(agendamentoQuiosqueService.update).toHaveBeenCalledWith(1, []);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(agendamentoQuiosque);

    component.isVisible = true;

    component.save();

    expect(agendamentoQuiosqueService.save).toHaveBeenCalledTimes(1);
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
    expect(agendamentoQuiosqueService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    agendamentoQuiosqueService.findById.mockReturnValue(of(agendamentoQuiosque));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(agendamentoQuiosqueService.findById).toHaveBeenCalledWith(1);
  })

  it('should search clientes', () => {
    const clientesToReturn = {content: [{id: 1}]};

    clienteService.findAll = jest.fn(() => of(clientesToReturn));

    component.searchClientes({query: 'teste'} as any);

    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.clientesSelect).toEqual(clientesToReturn.content);
  })

})
