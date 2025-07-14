import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaidaEstoqueFormComponent } from '../form/saida-estoque-form.component';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { SaidaEstoque } from "../../../model/saida-estoque.model";
import { SaidaEstoqueModule } from "../saida-estoque.module";
import { SaidaEstoqueService } from "../../../services/saida-estoque.service";
import { Produto } from "../../../model/produto.model";
import { TipoProduto } from "../../../../../main/entity/enums/tipo-produto";
import { ProdutoService } from "../../../services/produto.service";
import {CondicaoPagamento} from '../../../../../main/entity/condicao-pagamento.entity';
import {FormArray} from '@angular/forms';

describe("SaidaEstoqueFormComponent", () => {

  let fixture: ComponentFixture<SaidaEstoqueFormComponent>;
  let component: SaidaEstoqueFormComponent;
  let saidaEstoqueService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let saidaEstoque: SaidaEstoque;
  let produto: Produto
  let produtoService: any;

  beforeEach(async () => {
    saidaEstoqueService = {
      save: jest.fn(() => of({})),
      findById: jest.fn(() => of({})),
      update: jest.fn(() => of({}))
    };

    confirmationService = {
      confirm: jest.fn()
    }

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
      id: undefined,
      produto,
      quantidade: 3,
      requisitante: 'requisitante',
      observacao: 'observação',
    }

    produtoService = {
      findAll: jest.fn(() => of([]))
    }

    await TestBed.configureTestingModule({
      imports: [SaidaEstoqueModule],
      providers: [
        { provide: SaidaEstoqueService, useValue: saidaEstoqueService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ProdutoService, useValue: produtoService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SaidaEstoqueFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(saidaEstoqueService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const saidaEstoqueUpdate: SaidaEstoque = {
      id: 1,
      produto,
      quantidade: 4,
      requisitante: 'Lucas 2',
      observacao: 'observação 2',
    }

    component.form.patchValue(saidaEstoqueUpdate);

    component.originalValue = {...saidaEstoque, id: 1};

    component.isVisible = true;

    component.save();

    expect(saidaEstoqueService.update).toHaveBeenCalledTimes(1);
    expect(saidaEstoqueService.update).toHaveBeenCalledWith(1, [
      { op: 'replace', path: '/observacao', value: 'observação 2' },
      { op: 'replace', path: '/requisitante', value: 'Lucas 2' },
      { op: 'replace', path: '/quantidade', value: 4 },
    ]);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(saidaEstoque);

    component.isVisible = true;

    component.save();

    expect(saidaEstoqueService.save).toHaveBeenCalledTimes(1);
    expect(saidaEstoqueService.save).toHaveBeenCalledWith(saidaEstoque);
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
    expect(saidaEstoqueService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    saidaEstoqueService.findById.mockReturnValue(of(saidaEstoque));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(saidaEstoqueService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual(saidaEstoque);
  })

  it('should search produtos', () => {
    const produtosToReturn = {content: [produto]};

    produtoService.findAll = jest.fn(() => of(produtosToReturn));

    component.searchProdutos({query: 'teste'} as any);

    expect(produtoService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.produtosSelect).toEqual(produtosToReturn.content);
  })

})
