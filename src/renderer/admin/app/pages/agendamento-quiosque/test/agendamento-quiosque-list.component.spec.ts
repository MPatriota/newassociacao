import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {PageParameter} from "../../../../../shared/model/page-parameter";
import {ElectronService} from 'ngx-electron';
import { AgendamentoQuiosqueListComponent } from '../list/agendamento-quiosque-list.component';
import { AgendamentoQuiosqueModule } from '../agendamento-quiosque.module';
import { DateService } from '../../../../../shared/services/date.service';
import { AgendamentoQuiosqueService } from '../../../../../shared/services/agendamento-quiosque.service';

describe("AgendamentoQuiosqueListComponent", () => {

  let fixture: ComponentFixture<AgendamentoQuiosqueListComponent>;
  let component: AgendamentoQuiosqueListComponent;
  let agendamentoQuiosqueService: any;
  let dateService: any;
  let messageService: any;
  let confirmationService: any;
  let agendamentoQuiosque: any;

  beforeEach(async () => {
    agendamentoQuiosqueService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
      update: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    dateService = {
      getCurrentDate: jest.fn(() => new Date(2025, 4, 11)),
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn();

    agendamentoQuiosque = {
      id: 1,
      valor: 10,
      cliente: {
        id: 2
      } as any,
      dataAgendamento: new Date(2025, 4, 10)
    }

    await TestBed.configureTestingModule({
      imports: [AgendamentoQuiosqueModule],
      providers: [
        { provide: AgendamentoQuiosqueService, useValue: agendamentoQuiosqueService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ElectronService, useValue: ElectronService },
        { provide: DateService, useValue: dateService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamentoQuiosqueListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(agendamentoQuiosqueService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    agendamentoQuiosqueService.findAll.mockClear();

    component.onSearch('teste');

    expect(agendamentoQuiosqueService.findAll).toHaveBeenCalledTimes(1);
    expect(agendamentoQuiosqueService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=*teste*`,
          alias: 'quiosque'
        }
      ]
    });
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(agendamentoQuiosque);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(agendamentoQuiosque.id);
  })

  it('should fetch when close form', () => {
    agendamentoQuiosqueService.findAll.mockClear();

    component.onSave();

    expect(agendamentoQuiosqueService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=**`,
          alias: 'quiosque'
        }
      ]
    });
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete agendamento quiosque', () => {
    component.delete(agendamentoQuiosque);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o Agendamento de Quiosque?`,
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

    expect(agendamentoQuiosqueService.delete).toHaveBeenCalledTimes(1);
    expect(agendamentoQuiosqueService.delete).toHaveBeenCalledWith(agendamentoQuiosque.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento de Quiosque excluído com sucesso.' });
  })

  it('should confirm agendamento', () => {
    component.confirmarAgendamento({id: 1} as any);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja confirmar esse Agendamento de Quiosque?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'success',
      },
    }));
  })

  it('should realizar confirmação de agendamento', () => {
    component.confirmarAgendamento({id: 1, confirmado: false} as any);

    let [callArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    callArgument.accept!();

    expect(agendamentoQuiosqueService.update).toHaveBeenCalledTimes(1);
    expect(agendamentoQuiosqueService.update).toHaveBeenCalledWith(1, [
      { op: 'replace', path: '/confirmado', value: true },
      { op: 'add', path: '/dataConfirmacao', value: new Date(2025, 4, 11).toISOString() },
    ]);

  })
})
