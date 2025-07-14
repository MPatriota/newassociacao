import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepService } from "../../../../../shared/services/cep.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { notBlankValidator } from "../../../../../shared/util/validator-util";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { DocumentoTipo } from "../../../../../shared/enum/documento-tipo.enum";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";

@Component({
    selector: 'fornecedor-form',
    templateUrl: 'fornecedor-form.component.html',
    standalone: false
})
export class FornecedorFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  stepperActiveIndex = 1;
  originalValue?: Fornecedor;
  documentoTipoOptions = [
    { label: 'CPF', value: DocumentoTipo.CPF.value },
    { label: 'CNPJ', value: DocumentoTipo.CNPJ.value }
  ];
  protected readonly DocumentoTipo = DocumentoTipo;
  condicoesPagamentoSelect: CondicaoPagamento[] = [];

  constructor (
    private fornecedorService: FornecedorService,
    private fb: FormBuilder,
    private cepService: CepService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private condicaoPagamentoService: CondicaoPagamentoService
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.isVisibleChange){
      this.isVisibleChange.subscribe(id => {
        this.createForm();
        this.stepperActiveIndex = 1;
        this.isVisible = true;
        this.configureForm(id);
      })
    }
  }

  private createForm() {
    this.form = this.fb.group({
      id: [undefined],
      nome: ['', Validators.compose([notBlankValidator(), Validators.minLength(2), Validators.maxLength(100)])],
      documentoTipo: [DocumentoTipo.CPF.value, Validators.required],
      documento: ['', Validators.compose([notBlankValidator()])],
      responsavel: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.email])],
      telefone: ['', Validators.compose([notBlankValidator()])],
      endereco: this.fb.group({
        id: [undefined],
        cep: ['', Validators.compose([notBlankValidator()])],
        logradouro: ['', notBlankValidator()],
        numero: ['', notBlankValidator()],
        bairro: ['', notBlankValidator()],
        cidade: ['', notBlankValidator()],
        estado: ['', notBlankValidator()],
      }),
      condicaoPagamento: [null, Validators.required]
    })

    this.configureCEPChanges();
    this.configureDocumentoTipoChanges();
  }

  private configureCEPChanges() {
    let enderecoForm = this.form.get('endereco')!;
    let cepFormControl = enderecoForm.get('cep')!;

    cepFormControl.valueChanges.subscribe(value => {
      if(!value){
        return;
      }

      if(value.length == 8){
        this.cepService.findByCep(value).subscribe(cepAPIInformation => {
          enderecoForm.get('logradouro')?.patchValue(cepAPIInformation.logradouro);
          enderecoForm.get('bairro')?.patchValue(cepAPIInformation.bairro);
          enderecoForm.get('cidade')?.patchValue(cepAPIInformation.localidade);
          enderecoForm.get('estado')?.patchValue(cepAPIInformation.uf);
        })
      }
    })
  }

  private configureDocumentoTipoChanges() {
    this.form.get('documentoTipo')?.valueChanges.subscribe(value => {
      if(value == DocumentoTipo.CPF.value){
        let documentoFormControl = this.form.get('documento');

        documentoFormControl?.patchValue(documentoFormControl?.value?.slice(0, 11));
      }
    })
  }

  private configureForm(id?: number) {
    if(id){
      this.fornecedorService.findById(id).subscribe(foundFornecedor => {
        this.setFoundFornecedorFormValue(foundFornecedor)
      })
    }
  }

  private clearReferences() {
    this.originalValue = undefined;
  }

  private setFoundFornecedorFormValue(fornecedor: Fornecedor) {
    this.form.patchValue(fornecedor);
    this.originalValue = fornecedor;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const fornecedor: Fornecedor = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, fornecedor);

      this.fornecedorService.update(fornecedor.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor editado com sucesso' });
        this.afterSave();
      });
    } else {
      this.fornecedorService.save(removeNullOrUndefinedProperties(fornecedor)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor salvo com sucesso' });
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

  searchCondicoesPagamento(event: AutoCompleteCompleteEvent) {
    this.condicaoPagamentoService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(condicoesPagamento => {
      this.condicoesPagamentoSelect = condicoesPagamento.content;
    })
  }
}
