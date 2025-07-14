import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class QuiosqueForm {

  private readonly _form: FormGroup;

  get isInvalid() {
    return this._form.invalid;
  }

  get isDirty() {
    return this._form.dirty;
  }

  set status(status: boolean) {
    this._form.get('status')?.setValue(status);
  }

  get form() {
    return this._form;
  }

  constructor(private fb: FormBuilder) {
    this._form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.maxLength(50)]],
      capacidadeMaxima: ['', [Validators.required, Validators.min(1)]],
      valorAluguel: ['', [Validators.required, Validators.min(0.01)]],
      utensilios: this.fb.array([]),
      descricao: [''],
      status: [true],
      imagens: [null],
      salao: [false]
    });
  }

}
