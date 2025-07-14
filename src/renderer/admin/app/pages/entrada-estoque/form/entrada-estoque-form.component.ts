import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { EntradaEstoque } from "../../../../../shared/model/entrada-estoque.model";
import { EntradaEstoqueService } from "../../../../../shared/services/entrada-estoque.service";
import { Produto } from "../../../../../shared/model/produto.model";
import { ProdutoService } from "../../../../../shared/services/produto.service";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import { EntradaEstoqueTipoEnum } from "../../../../../shared/enum/entrada-estoque-tipo.enum";
import moment from "moment";
import {DateService} from '../../../../../shared/services/date.service';
import {ContaPagar} from '../../../../../shared/model/conta-pagar.model';
import {notBlankValidator} from '../../../../../shared/util/validator-util';
import { CondicaoPagamentoService } from '../../../../../shared/services/condicao-pagamento.service';

@Component({
    selector: 'entrada-estoque-form',
    templateUrl: 'entrada-estoque-form.component.html',
    standalone: false
})
export class EntradaEstoqueFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: EntradaEstoque;
  produtosSelect: Produto[] = []
  fornecedoresSelect: Fornecedor[] = []
  entradaEstoqueTipoSelect: EntradaEstoqueTipoEnum[] = [
    EntradaEstoqueTipoEnum.COM_FORNECEDOR,
    EntradaEstoqueTipoEnum.SEM_FORNECEDOR,
  ]
  protected readonly entradaEstoqueTipoEnum = EntradaEstoqueTipoEnum;
  contasPagarChildren: ContaPagar[] = [];
  stepperActiveIndex = 1;

  constructor (
    private entradaEstoqueService: EntradaEstoqueService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private dateService: DateService,
    private condicaoPagamentoService: CondicaoPagamentoService
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.isVisibleChange){
      this.isVisibleChange.subscribe(id => {
        this.createForm();
        this.isVisible = true;
        this.stepperActiveIndex = 1;
        this.configureForm(id);
      })
    }
  }

  private createForm() {
    this.form = this.fb.group({
      id: [undefined],
      produto: [null, Validators.required],
      quantidade: [1, Validators.compose([Validators.min(1), Validators.required])],
      valor: [1, Validators.compose([Validators.min(0.01), Validators.required])],
      subtotal: [{value: 1, disabled: true}],
      requisitante: ['', this.requisitanteConditionalValidators()],
      observacao: ['', Validators.max(500)],
      fornecedor: [undefined, this.fornecedorConditionalValidators()],
      tipo: [EntradaEstoqueTipoEnum.COM_FORNECEDOR],
      contasPagar: this.fb.array([])
    })

    this.configureTipoChanges();
    this.configureSubtotal();
    this.configureFornecedorChanges();
  }

  private requisitanteConditionalValidators(): ValidatorFn {
    return (control): ValidationErrors | null => {
      let tipo = this.form?.get('tipo')?.value;

      if (EntradaEstoqueTipoEnum.SEM_FORNECEDOR == tipo) {
        let validatorsCompose = Validators.compose([
          notBlankValidator(),
          Validators.max(100)
        ])!;

        return validatorsCompose(control);
      }

      return null;
    }
  }

  private fornecedorConditionalValidators(): ValidatorFn {
    return (control) => {
      let tipo = this.form?.get('tipo')?.value;

      if (EntradaEstoqueTipoEnum.COM_FORNECEDOR == tipo) {
        return Validators.required(control);
      }

      return null;
    }
  }

  createContaPagarForm() {
    return () => this.fb.group({
      id: [undefined],
      fornecedor: this.fb.control<Fornecedor | undefined>(undefined),
      valor: [0.01, Validators.compose([Validators.min(0.01)])],
      dataVencimento: [this.dateService.getCurrentDate()]
    })
  }

  private configureTipoChanges() {
    const tipoFormControl = this.form.get('tipo');
    const fornecedorFormControl = this.form.get('fornecedor');
    const requisitanteFormControl = this.form.get('requisitante');

    tipoFormControl?.valueChanges.subscribe((tipo: EntradaEstoqueTipoEnum) => {
      if(tipo == EntradaEstoqueTipoEnum.SEM_FORNECEDOR) {
        fornecedorFormControl?.reset();
      } else {
        requisitanteFormControl?.patchValue('');
      }
    })
  }

  private configureSubtotal() {
    const subtotalFormControl = this.form.get('subtotal');
    const quantidadeFormControl = this.form.get('quantidade');
    const valorFormControl = this.form.get('valor');

    quantidadeFormControl?.valueChanges.subscribe((quantidade) => {
      subtotalFormControl?.patchValue(this.calculateSubtotal(quantidade, valorFormControl?.value));
    })

    valorFormControl?.valueChanges.subscribe((valor) => {
      subtotalFormControl?.patchValue(this.calculateSubtotal(valor, quantidadeFormControl?.value));
    })

  }

  private configureFornecedorChanges() {
    this.contasPagarChildren = [];

    this.form.get('fornecedor')?.valueChanges.subscribe((fornecedor: Fornecedor) => {
      const contasPagarFormArray = <FormArray> this.form.get('contasPagar');

      contasPagarFormArray.clear();
      this.contasPagarChildren = [];

      if(!fornecedor) {
        return
      }

      const condicaoPagamento = fornecedor.condicaoPagamento;

      if(!condicaoPagamento){
        return
      }

      let valorParcela = this.form.get('subtotal')?.value / condicaoPagamento.parcelas;

      const contasPagar = [];

      const dates = this.condicaoPagamentoService.generateDates(condicaoPagamento);

      for (let date of dates) {
        contasPagar.push({
          fornecedor,
          valor: valorParcela,
          dataVencimento: date
        });
      }

      this.contasPagarChildren = contasPagar;
    })
  }

  private calculateSubtotal(quantidade = 0, valor = 0) {
    return quantidade * valor;
  }

  private configureForm(id?: number) {
    if(id){
      this.entradaEstoqueService.findById(id).subscribe(foundEntradaEstoque => {
        this.setFoundEntradaEstoqueFormValue(foundEntradaEstoque)
      })
    }
  }

  private clearReferences() {
    this.originalValue = undefined;
  }

  private setFoundEntradaEstoqueFormValue(entradaEstoque: EntradaEstoque) {
    this.form.patchValue(entradaEstoque);
    this.originalValue = entradaEstoque;
    this.contasPagarChildren = entradaEstoque.contasPagar;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const entradaEstoque: EntradaEstoque = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, entradaEstoque);

      this.entradaEstoqueService.update(entradaEstoque.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entrada de Estoque editada com sucesso' });
        this.afterSave();
      });
    } else {
      this.entradaEstoqueService.save(removeNullOrUndefinedProperties(entradaEstoque)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entrada de Estoque salva com sucesso' });
        this.afterSave();
      })
    }
  }

  private afterSave() {
    this.onSave.emit();
    this.internalCloseForm();
  }

  closeForm() {
    if(this.form.dirty){
      this.confirmationService.confirm({
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
        },
        accept: () => {
          this.internalCloseForm();
        }
      });

      return;
    }

    this.internalCloseForm();
  }

  private internalCloseForm() {
    this.clearReferences();
    this.isVisible = false;
  }

  produtoLabel(produto: Produto) {
    return `${produto.nome} - Estoque Atual: ${produto.estoque}`;
  }

  searchProdutos(event: AutoCompleteCompleteEvent) {
    this.produtoService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(produtos => {
      this.produtosSelect = produtos.content;
    })
  }

  searchFornecedores(event: AutoCompleteCompleteEvent) {
    this.fornecedorService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(fornecedores => {
      this.fornecedoresSelect = fornecedores.content;
    })
  }

  get contasPagarFormArray() {
    return <FormArray> this.form.get('contasPagar');
  }

}
