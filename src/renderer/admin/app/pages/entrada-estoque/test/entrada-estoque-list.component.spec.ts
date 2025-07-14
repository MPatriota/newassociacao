import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {EntradaEstoqueListComponent} from "../list/entrada-estoque-list.component";
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {PageParameter} from "../../../../../shared/model/page-parameter";
import {EntradaEstoqueModule} from "../entrada-estoque.module";
import {EntradaEstoque} from "../../../../../shared/model/entrada-estoque.model";
import {EntradaEstoqueService} from "../../../../../shared/services/entrada-estoque.service";
import {Produto} from "../../../../../shared/model/produto.model";
import {TipoProduto} from "../../../../../../main/entity/enums/tipo-produto";
import {ProdutoService} from "../../../../../shared/services/produto.service";
import {EntradaEstoqueTipoEnum} from '../../../../../shared/enum/entrada-estoque-tipo.enum';
import {DateService} from '../../../../../shared/services/date.service';
import {ElectronService} from 'ngx-electron';

describe("EntradaEstoqueListComponent", () => {

  let fixture: ComponentFixture<EntradaEstoqueListComponent>;
  let component: EntradaEstoqueListComponent;
  let entradaEstoqueService: any;
  let messageService: any;
  let confirmationService: any;
  let entradaEstoque: EntradaEstoque;
  let produto: Produto;
  let produtoService: any;
  let dateService: any;

  beforeEach(async () => {
    entradaEstoqueService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
    }

    dateService = {
      getCurrentDate: jest.fn(() => new Date(2025, 2, 21))
    }

    confirmationService = new ConfirmationService();
    confirmationService.confirm = jest.fn()

    produto = {
      nome: 'produto',
      valor: 10.0,
      custo: 5.0,
      tipo: TipoProduto.CANTINA,
      estoque: 10,
      estoqueMinimo: 5,
      tags: [],
      imagem: 'teste',
      dataCadastro: new Date(2025, 2, 11)
    }

    entradaEstoque = {
      id: 1,
      produto,
      quantidade: 3,
      valor: 10,
      requisitante: 'Lucas',
      observacao: 'observação',
      subtotal: 30,
      tipo: EntradaEstoqueTipoEnum.SEM_FORNECEDOR,
      contasPagar: []
    }

    produtoService = {
      findAll: jest.fn(() => of([]))
    }

    await TestBed.configureTestingModule({
      imports: [EntradaEstoqueModule],
      providers: [
        { provide: EntradaEstoqueService, useValue: entradaEstoqueService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ProdutoService, useValue: produtoService },
        { provide: DateService, useValue: dateService },
        { provide: ElectronService, useValue: ElectronService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaEstoqueListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(entradaEstoqueService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    entradaEstoqueService.findAll.mockClear();

    component.onSearch('teste');

    expect(entradaEstoqueService.findAll).toHaveBeenCalledTimes(1);
    expect(entradaEstoqueService.findAll).toHaveBeenCalledWith(1, 10, {
      children: [
        {
          statement: `nome=ilike=*teste*`,
          alias: 'produto'
        }
      ]
    });
  })

  it('should open form when click new', () => {
    component.clickNew();

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith();
  })

  it('should edit', () => {
    component.edit(entradaEstoque);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(entradaEstoque.id);
  })

  it('should fetch when close form', () => {
    entradaEstoqueService.findAll.mockClear();

    component.onSave();

    expect(entradaEstoqueService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete entrada estoque', () => {
    component.delete(entradaEstoque);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Entrada de Estoque?`,
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

    expect(entradaEstoqueService.delete).toHaveBeenCalledTimes(1);
    expect(entradaEstoqueService.delete).toHaveBeenCalledWith(entradaEstoque.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Entrada de Estoque excluída com sucesso.' });
  })
})
