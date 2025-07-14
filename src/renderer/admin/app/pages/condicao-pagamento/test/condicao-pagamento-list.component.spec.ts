import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CondicaoPagamentoListComponent } from "../list/condicao-pagamento-list.component";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { PageParameter } from "../../../../../shared/model/page-parameter";
import { CondicaoPagamentoModule } from "../condicao-pagamento.module";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";

describe("CondicaoPagamentoListComponent", () => {

  let fixture: ComponentFixture<CondicaoPagamentoListComponent>;
  let component: CondicaoPagamentoListComponent;
  let condicaoPagamentoService: any;
  let messageService: any;
  let confirmationService: any;
  let condicaoPagamento: CondicaoPagamento;

  beforeEach(async () => {
    condicaoPagamentoService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn()

    condicaoPagamento = {
      id: 1,
      nome: 'Lucas',
      parcelas: 1,
      intervalo: 2,
      vencimento: 3,
      descricao: 'descricao',
      ativa: true
    }

    await TestBed.configureTestingModule({
      imports: [CondicaoPagamentoModule],
      providers: [
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicaoPagamentoListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(condicaoPagamentoService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    condicaoPagamentoService.findAll.mockClear();

    component.onSearch('teste');

    expect(condicaoPagamentoService.findAll).toHaveBeenCalledTimes(1);
    expect(condicaoPagamentoService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*;documento=ilike=*teste*');
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(condicaoPagamento);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(condicaoPagamento.id);
  })

  it('should fetch when close form', () => {
    condicaoPagamentoService.findAll.mockClear();

    component.onSave();

    expect(condicaoPagamentoService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete condicao pagamento', () => {
    component.delete(condicaoPagamento);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Condição de Pagamento <b>${condicaoPagamento.nome}</b>?`,
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

    expect(condicaoPagamentoService.delete).toHaveBeenCalledTimes(1);
    expect(condicaoPagamentoService.delete).toHaveBeenCalledWith(condicaoPagamento.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Condição de Pagamento excluída com sucesso.' });
  })
})
