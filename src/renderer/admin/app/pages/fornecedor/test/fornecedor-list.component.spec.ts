import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FornecedorListComponent } from "../list/fornecedor-list.component";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { PageParameter } from "../../../../../shared/model/page-parameter";
import { FornecedorModule } from "../fornecedor.module";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import { DocumentoTipo } from "../../../../../shared/enum/documento-tipo.enum";
import { Endereco } from "../../../../../shared/model/endereco.model";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";

describe("FornecedorListComponent", () => {

  let fixture: ComponentFixture<FornecedorListComponent>;
  let component: FornecedorListComponent;
  let fornecedorService: any;
  let messageService: any;
  let confirmationService: any;
  let fornecedor: Fornecedor;
  let endereco: Endereco;
  let condicaoPagamentoService: any;
  let condicaoPagamento: CondicaoPagamento;


  beforeEach(async () => {
    fornecedorService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn()

    endereco = {
      id: 1,
      cep: '12345678',
      logradouro: 'rua teste',
      numero: '69',
      bairro: 'bairro teste',
      cidade: 'Maringá',
      estado: 'PR'
    }

    condicaoPagamento = {
      id: 1,
      nome: 'Lucas',
      parcelas: 1,
      intervalo: 2,
      vencimento: 3,
      descricao: 'descricao',
      ativa: true
    }

    fornecedor = {
      id: 1,
      nome: 'Lucas',
      documento: '12345678901',
      responsavel: 'Responsável',
      email: 'empresa@email.com',
      telefone: '44999999999',
      documentoTipo: DocumentoTipo.CPF.value,
      endereco,
      condicaoPagamento
    }

    condicaoPagamentoService = {
      findAll: jest.fn(() => of({content: []}))
    };

    await TestBed.configureTestingModule({
      imports: [FornecedorModule],
      providers: [
        { provide: FornecedorService, useValue: fornecedorService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(fornecedorService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    fornecedorService.findAll.mockClear();

    component.onSearch('teste');

    expect(fornecedorService.findAll).toHaveBeenCalledTimes(1);
    expect(fornecedorService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*;documento=ilike=*teste*');
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(fornecedor);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(fornecedor.id);
  })

  it('should fetch when close form', () => {
    fornecedorService.findAll.mockClear();

    component.onSave();

    expect(fornecedorService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete fornecedor', () => {
    component.delete(fornecedor);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o fornecedor <b>${fornecedor.nome}</b>?`,
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

    expect(fornecedorService.delete).toHaveBeenCalledTimes(1);
    expect(fornecedorService.delete).toHaveBeenCalledWith(fornecedor.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor excluído com sucesso.' });
  })
})
