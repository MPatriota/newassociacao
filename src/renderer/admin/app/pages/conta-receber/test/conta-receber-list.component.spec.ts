import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {PageParameter} from "../../../../../shared/model/page-parameter";
import {ElectronService} from 'ngx-electron';
import { ContaReceberListComponent } from '../list/conta-receber-list.component';
import { ContaReceberModule } from '../conta-receber.module';
import { ContaReceberService } from '../../../../../shared/services/conta-receber.service';
import { DateService } from '../../../../../shared/services/date.service';

describe("ContaReceberListComponent", () => {

  let fixture: ComponentFixture<ContaReceberListComponent>;
  let component: ContaReceberListComponent;
  let contaReceberService: any;
  let dateService: any;
  let messageService: any;
  let confirmationService: any;
  let contaReceber: any;

  beforeEach(async () => {
    contaReceberService = {
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

    contaReceber = {
      id: 1,
      valor: 10,
      cliente: {
        id: 2
      } as any,
      dataVencimento: new Date(2025, 4, 10)
    }

    await TestBed.configureTestingModule({
      imports: [ContaReceberModule],
      providers: [
        { provide: ContaReceberService, useValue: contaReceberService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ElectronService, useValue: ElectronService },
        { provide: DateService, useValue: dateService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaReceberListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(contaReceberService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    contaReceberService.findAll.mockClear();

    component.onSearch('teste');

    expect(contaReceberService.findAll).toHaveBeenCalledTimes(1);
    expect(contaReceberService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=*teste*`,
          alias: 'cliente'
        }
      ]
    });
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(contaReceber);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(contaReceber.id);
  })

  it('should fetch when close form', () => {
    contaReceberService.findAll.mockClear();

    component.onSave();

    expect(contaReceberService.findAll).toHaveBeenCalledWith(1, 10, {
      statement: "",
      children: [
        {
          statement: `nome=ilike=**`,
          alias: 'cliente'
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

  it('should delete conta receber', () => {
    component.delete(contaReceber);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Conta a Receber?`,
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

    expect(contaReceberService.delete).toHaveBeenCalledTimes(1);
    expect(contaReceberService.delete).toHaveBeenCalledWith(contaReceber.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Receber excluída com sucesso.' });
  })

  it('should confirm baixa', () => {
    component.confirmarBaixa({id: 1} as any);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja dar baixa nessa Conta a Receber?`,
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

    expect(contaReceberService.update).toHaveBeenCalledTimes(1);
    expect(contaReceberService.update).toHaveBeenCalledWith(1, [
      { op: 'replace', path: '/paga', value: true },
      { op: 'add', path: '/dataPagamento', value: new Date(2025, 4, 11).toISOString() },
    ]);

  })
})
