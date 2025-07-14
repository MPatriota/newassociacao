import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {PageParameter} from "../../../../../shared/model/page-parameter";
import {ElectronService} from 'ngx-electron';
import { ContaPagarListComponent } from '../list/conta-pagar-list.component';
import { ContaPagarModule } from '../conta-pagar.module';
import { ContaPagarService } from '../../../../../shared/services/conta-pagar.service';
import { DateService } from '../../../../../shared/services/date.service';

describe("ContaPagarListComponent", () => {

  let fixture: ComponentFixture<ContaPagarListComponent>;
  let component: ContaPagarListComponent;
  let contaPagarService: any;
  let dateService: any;
  let messageService: any;
  let confirmationService: any;
  let contaPagar: any;

  beforeEach(async () => {
    contaPagarService = {
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

    contaPagar = {
      id: 1,
      valor: 10,
      fornecedor: {
        id: 2
      } as any,
      dataVencimento: new Date(2025, 4, 10)
    }

    await TestBed.configureTestingModule({
      imports: [ContaPagarModule],
      providers: [
        { provide: ContaPagarService, useValue: contaPagarService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ElectronService, useValue: ElectronService },
        { provide: DateService, useValue: dateService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaPagarListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(contaPagarService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    contaPagarService.findAll.mockClear();

    component.onSearch('teste');

    expect(contaPagarService.findAll).toHaveBeenCalledTimes(1);
    expect(contaPagarService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=*teste*`,
          alias: 'fornecedor'
        }
      ]
    });
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(contaPagar);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(contaPagar.id);
  })

  it('should fetch when close form', () => {
    contaPagarService.findAll.mockClear();

    component.onSave();

    expect(contaPagarService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=**`,
          alias: 'fornecedor'
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

  it('should delete conta pagar', () => {
    component.delete(contaPagar);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Conta a Pagar?`,
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

    expect(contaPagarService.delete).toHaveBeenCalledTimes(1);
    expect(contaPagarService.delete).toHaveBeenCalledWith(contaPagar.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Pagar excluída com sucesso.' });
  })

  it('should confirm baixa', () => {
    component.confirmarBaixa({id: 1} as any);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja dar baixa nessa Conta a Pagar?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'danger',
      },
    }));
  })

  it('should realizar baixa', () => {
    component.confirmarBaixa({id: 1, paga: false} as any);

    let [callArgument]: Confirmation[] = confirmationService.confirm.mock.calls[0];

    callArgument.accept!();

    expect(contaPagarService.update).toHaveBeenCalledTimes(1);
    expect(contaPagarService.update).toHaveBeenCalledWith(1, [
      { op: 'replace', path: '/paga', value: true },
      { op: 'add', path: '/dataPagamento', value: new Date(2025, 4, 11).toISOString() },
    ]);

  })
})
