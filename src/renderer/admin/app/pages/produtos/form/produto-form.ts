import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Decimal from 'decimal.js';
import { Produto } from '../../../../../shared/model/produto.model';
import { Tag } from '../../../../../shared/model/tag.model';
import { log } from 'electron-builder';
import { notBlankValidator } from '../../../../../shared/util/validator-util';

export class ProdutoForm {

  private readonly _form: FormGroup;

  get form() {
    return this._form;
  }

  get tags() {
    return this.form.get('tags')?.value;
  }

  get isInvalid() {
    return this._form.invalid;
  }

  set type(tipo: any) {
    this._form.get('tipo')?.setValue(tipo);
  }

  set image(image: Uint8Array | undefined) {
    this._form.get('imagem')?.setValue(image);
  }

  set defaultValue(produto: Produto) {
    this._form.patchValue(produto);
  }

  get id() {
    return this.form.get('id')?.value;
  }

  get isNew() {
    return !this.form.get('id')?.value;
  }

  get custoMaiorVenda() {
    const custo = new Decimal(this.form.get('custo')?.value ?? 0);
    const venda = new Decimal(this.form.get('valor')?.value ?? 0);
    return custo.greaterThan(venda);
  }

  constructor(private _fb: FormBuilder) {

    this._form = _fb.group({
      'id': [null],
      'nome': ['', Validators.compose([Validators.required, Validators.maxLength(100), notBlankValidator()])],
      'tipo': [null, Validators.required],
      'valor': [null, Validators.required],
      'custo': [null, Validators.required],
      'estoque': [null, Validators.required],
      'estoqueMinimo': [null, Validators.required],
      'imagem': [null],
      'tags': new FormControl([]),
      'anotacoes': ['', Validators.maxLength(500)]
    });

  }

  payload(image: string | undefined): Produto {
    return {...this.form.value, imagem: image } as Produto;
  }

}
