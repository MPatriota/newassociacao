import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaEstoqueFormComponent } from '../form/entrada-estoque-form.component';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventEmitter } from "@angular/core";
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";
import { EntradaEstoque } from "../../../../../shared/model/entrada-estoque.model";
import { EntradaEstoqueModule } from "../entrada-estoque.module";
import { EntradaEstoqueService } from "../../../../../shared/services/entrada-estoque.service";
import { Produto } from "../../../../../shared/model/produto.model";
import { ProdutoService } from "../../../../../shared/services/produto.service";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { DocumentoTipo } from "../../../../../shared/enum/documento-tipo.enum";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import { EntradaEstoqueTipoEnum } from "../../../../../shared/enum/entrada-estoque-tipo.enum";
import {FormArray} from '@angular/forms';
import {DateService} from '../../../../../shared/services/date.service';
import {ContaPagar} from '../../../../../shared/model/conta-pagar.model';
import { CondicaoPagamentoService } from '../../../../../shared/services/condicao-pagamento.service';

describe("EntradaEstoqueFormComponent", () => {

  let fixture: ComponentFixture<EntradaEstoqueFormComponent>;
  let component: EntradaEstoqueFormComponent;
  let entradaEstoqueService: any;
  let isVisibleChange = new EventEmitter<number | undefined>;
  let confirmationService: any;
  let entradaEstoque: EntradaEstoque;
  let produto: Produto
  let produtoService: any;
  let fornecedorService: any;
  let fornecedor: Fornecedor;
  let dateService: any;
  let contaPagar: ContaPagar;
  let condicaoPagamentoService: any;

  beforeEach(async () => {
    entradaEstoqueService = {
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
      tipo: "Cantina" as any,
      estoque: 10,
      estoqueMinimo: 5,
      tags: [],
      imagem: 'teste',
      dataCadastro: new Date(2025, 2, 11)
    }

    fornecedor = {
      id: 1,
      nome: 'Lucas',
      documento: '12345678901',
      responsavel: 'Responsável',
      email: 'empresa@email.com',
      telefone: '44999999999',
      documentoTipo: DocumentoTipo.CPF.value,
    }

    contaPagar = {
      id: undefined,
      valor: 10,
      dataVencimento: new Date(2025, 2, 21),
      fornecedor
    }

    entradaEstoque = {
      id: undefined,
      produto,
      quantidade: 3,
      valor: 10,
      subtotal: 30,
      observacao: 'observação',
      tipo: EntradaEstoqueTipoEnum.COM_FORNECEDOR,
      fornecedor,
      contasPagar: [contaPagar]
    }

    produtoService = {
      findAll: jest.fn(() => of([]))
    }

    fornecedorService = {
      findAll: jest.fn(() => of([]))
    }

    dateService = {
      getCurrentDate: jest.fn(() => new Date(2025, 2, 21))
    }

    condicaoPagamentoService = {
      generateDates: jest.fn(() => [])
    }

    await TestBed.configureTestingModule({
      imports: [EntradaEstoqueModule],
      providers: [
        { provide: EntradaEstoqueService, useValue: entradaEstoqueService },
        { provide: ConfirmationService, useValue: confirmationService },
        { provide: ProdutoService, useValue: produtoService },
        { provide: FornecedorService, useValue: fornecedorService },
        { provide: DateService, useValue: dateService },
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        provideAnimations(),
        MessageService
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaEstoqueFormComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.onSave, 'emit');
    component.isVisibleChange = isVisibleChange;
    fixture.detectChanges();
  })

  it('should not save if form is invalid', () => {
    component.form.setErrors({someError: true});

    component.save();

    expect(entradaEstoqueService.save).not.toHaveBeenCalled();
  })

  it('should update', () => {
    const entradaEstoqueUpdate: EntradaEstoque = {
      id: 1,
      produto,
      quantidade: 4,
      valor: 15,
      subtotal: 60,
      requisitante: 'Lucas 2',
      observacao: 'observação 2',
      tipo: EntradaEstoqueTipoEnum.SEM_FORNECEDOR,
      fornecedor: undefined,
      contasPagar: []
    }

    component.form.patchValue(entradaEstoqueUpdate);

    component.originalValue = {...entradaEstoque, id: 1};

    component.isVisible = true;

    component.save();

    expect(entradaEstoqueService.update).toHaveBeenCalledTimes(1);
    expect(entradaEstoqueService.update).toHaveBeenCalledWith(1, [
      { op: 'remove', path: '/contasPagar/0' },
      { op: 'remove', path: '/fornecedor' },
      { op: 'replace', path: '/tipo', value: 'Sem Fornecedor' },
      { op: 'replace', path: '/observacao', value: 'observação 2' },
      { op: 'replace', path: '/subtotal', value: 60 },
      { op: 'replace', path: '/valor', value: 15 },
      { op: 'replace', path: '/quantidade', value: 4 },
      { op: 'add', path: '/requisitante', value: 'Lucas 2' },
    ]);
    expect(component.onSave.emit).toHaveBeenCalledTimes(1);
    expect(component.isVisible).toBeFalsy();
    expect(component.originalValue).toBeUndefined();
  })

  it('should save', () => {
    component.form.patchValue(entradaEstoque);

    component.isVisible = true;

    component.save();

    expect(entradaEstoqueService.save).toHaveBeenCalledTimes(1);
    expect(entradaEstoqueService.save).toHaveBeenCalledWith({...entradaEstoque, requisitante: '', contasPagar: []});
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
    expect(entradaEstoqueService.findById).not.toHaveBeenCalled();
  })

  it('visible change with id', () => {
    entradaEstoqueService.findById.mockReturnValue(of(entradaEstoque));

    component.isVisible = false;

    isVisibleChange.emit(1);

    expect(component.isVisible).toBeTruthy();
    expect(entradaEstoqueService.findById).toHaveBeenCalledWith(1);
    expect(component.form.getRawValue()).toEqual({...entradaEstoque, requisitante: '', contasPagar: []});
  })

  it('should search produtos', () => {
    const produtosToReturn = {content: [produto]};

    produtoService.findAll = jest.fn(() => of(produtosToReturn));

    component.searchProdutos({query: 'teste'} as any);

    expect(produtoService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.produtosSelect).toEqual(produtosToReturn.content);
  })

  it('should search fornecedores', () => {
    const fornecedoresToReturn = {content: [fornecedor]};

    fornecedorService.findAll = jest.fn(() => of(fornecedoresToReturn));

    component.searchFornecedores({query: 'teste'} as any);

    expect(fornecedorService.findAll).toHaveBeenCalledWith(1, 10, 'nome=ilike=*teste*');
    expect(component.fornecedoresSelect).toEqual(fornecedoresToReturn.content);
  })

  it('should clear when change tipo', () => {
    const tipoFormControl = component.form.get('tipo');

    tipoFormControl?.patchValue(EntradaEstoqueTipoEnum.COM_FORNECEDOR);

    const fornecedorFormControl = component.form.get('fornecedor');

    fornecedorFormControl?.patchValue(fornecedor);

    tipoFormControl?.patchValue(EntradaEstoqueTipoEnum.SEM_FORNECEDOR);

    expect(fornecedorFormControl?.value).toBeNull();

    const requisitanteFormControl = component.form.get('requisitante');

    requisitanteFormControl?.patchValue("requisitante");

    tipoFormControl?.patchValue(EntradaEstoqueTipoEnum.COM_FORNECEDOR);

    expect(requisitanteFormControl?.value).toEqual('');
  })

  it('should att subtotal when quantidade or valor changes', () => {
    let quantidadeFormControl = component.form.get('quantidade');
    let valorFormControl = component.form.get('valor');
    let subtotalFormControl = component.form.get('subtotal');

    expect(quantidadeFormControl?.value).toBe(1);
    expect(valorFormControl?.value).toBe(1);
    expect(subtotalFormControl?.value).toBe(1);

    quantidadeFormControl?.patchValue(2);

    expect(subtotalFormControl?.value).toBe(2);

    valorFormControl?.patchValue(2);

    expect(subtotalFormControl?.value).toBe(4);
  })

  it('should create conta a pagar when fornecedor changes', () => {
    condicaoPagamentoService.generateDates = jest.fn(() => [
      new Date(2025, 2, 26),
      new Date(2025, 2, 30),
      new Date(2025, 3, 3)
    ])

    const fornecedorFormControl = component.form.get('fornecedor');
    const contasPagarFormArray = <FormArray> component.form.get('contasPagar');

    component.form.get('quantidade')?.patchValue(11);
    component.form.get('valor')?.patchValue(1.59);

    const condicaoPagamento = {
      id: 1,
      nome: 'Lucas',
      parcelas: 3,
      intervalo: 4,
      vencimento: 5,
      descricao: 'descricao',
      ativa: true
    };

    fornecedor = {...fornecedor, condicaoPagamento};

    fornecedorFormControl?.patchValue(fornecedor);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const contaPagar1 = contasPagarFormArray.at(0).getRawValue();
      expect(contaPagar1.dataVencimento.toString()).toEqual(new Date(2025, 2, 26).toString());
      expect(contaPagar1.fornecedor).toEqual(fornecedor);
      expect(contaPagar1.valor).toBeCloseTo(5.83);

      const contaPagar2 = contasPagarFormArray.at(1).getRawValue();
      expect(contaPagar2.dataVencimento.toString()).toEqual(new Date(2025, 2, 30).toString());
      expect(contaPagar2.fornecedor).toEqual(fornecedor);
      expect(contaPagar2.valor).toBeCloseTo(5.83);

      const contaPagar3 = contasPagarFormArray.at(2).getRawValue();
      expect(contaPagar3.dataVencimento.toString()).toEqual(new Date(2025, 3, 3).toString());
      expect(contaPagar3.fornecedor).toEqual(fornecedor);
      expect(contaPagar3.valor).toBeCloseTo(5.83);
    })
  })

  it('should set fornecedor conditional validators', () => {
    let fornecedorFormControl = component.form.get('fornecedor');

    component.form.get('tipo')?.patchValue(EntradaEstoqueTipoEnum.COM_FORNECEDOR);
    fornecedorFormControl?.patchValue(null);

    expect(fornecedorFormControl?.errors).toEqual({required: true});
  })

  it('should set requisitante conditional validators', () => {
    let requisitanteFormControl = component.form.get('requisitante');

    component.form.get('tipo')?.patchValue(EntradaEstoqueTipoEnum.SEM_FORNECEDOR);
    requisitanteFormControl?.patchValue('');

    expect(requisitanteFormControl?.errors).toEqual({'notBlank': true});
  })
})
