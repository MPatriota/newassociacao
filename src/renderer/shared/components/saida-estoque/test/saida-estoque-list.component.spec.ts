import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {SaidaEstoqueListComponent} from "../list/saida-estoque-list.component";
import {Confirmation, ConfirmationService, MessageService} from "primeng/api";
import {PageParameter} from "../../../model/page-parameter";
import {SaidaEstoqueModule} from "../saida-estoque.module";
import {SaidaEstoque} from "../../../model/saida-estoque.model";
import {SaidaEstoqueService} from "../../../services/saida-estoque.service";
import {Produto} from "../../../model/produto.model";
import {TipoProduto} from "../../../../../main/entity/enums/tipo-produto";
import {ProdutoService} from "../../../services/produto.service";

describe("SaidaEstoqueListComponent", () => {

  let fixture: ComponentFixture<SaidaEstoqueListComponent>;
  let component: SaidaEstoqueListComponent;
  let saidaEstoqueService: any;
  let messageService: any;
  let confirmationService: any;
  let saidaEstoque: SaidaEstoque;
  let produto: Produto;
  let produtoService: any;

  beforeEach(async () => {
    saidaEstoqueService = {
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
      findAll: jest.fn(() => of({})),
    };

    messageService = {
      add: jest.fn()
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

    saidaEstoque = {
      id: 1,
      produto,
      quantidade: 3,
      requisitante: 'Lucas',
      observacao: 'observação',
    }

    produtoService = {
      findAll: jest.fn(() => of([]))
    }

    await TestBed.configureTestingModule({
      imports: [SaidaEstoqueModule],
      providers: [
        { provide: SaidaEstoqueService, useValue: saidaEstoqueService },
        { provide: MessageService, useValue: messageService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ProdutoService, useValue: produtoService },
        provideAnimations(),
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SaidaEstoqueListComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.formVisibleChange, 'emit');
    fixture.detectChanges();
  })

  it('should fetch on init', () => {
    expect(saidaEstoqueService.findAll).toHaveBeenCalledTimes(1);
  })

  it('should search', () => {
    saidaEstoqueService.findAll.mockClear();

    component.onSearch('teste');

    expect(saidaEstoqueService.findAll).toHaveBeenCalledTimes(1);
    expect(saidaEstoqueService.findAll).toHaveBeenCalledWith(1, 10, {
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
    component.edit(saidaEstoque);

    expect(component.formVisibleChange.emit).toHaveBeenCalledWith(saidaEstoque.id);
  })

  it('should fetch when close form', () => {
    saidaEstoqueService.findAll.mockClear();

    component.onSave();

    expect(saidaEstoqueService.findAll).toHaveBeenCalledWith(1, 10, '');
  })

  it('loadData', () => {
    let pageParameter = new PageParameter(2, 15);
    component.loadData(pageParameter);

    expect(component.pageParameters.page).toEqual(2);
    expect(component.pageParameters.limit).toEqual(15);
  })

  it('should delete saida estoque', () => {
    component.delete(saidaEstoque);

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmationService.confirm).toHaveBeenCalledWith(expect.objectContaining({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir a Saída de Estoque?`,
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

    expect(saidaEstoqueService.delete).toHaveBeenCalledTimes(1);
    expect(saidaEstoqueService.delete).toHaveBeenCalledWith(saidaEstoque.id);
    expect(messageService.add).toHaveBeenCalledTimes(1);
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Sucesso', detail: 'Saída de Estoque excluída com sucesso.' });
  })
})
