import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { Cliente } from "../../../../../shared/model/cliente.model";
import { CepService } from "../../../../../shared/services/cep.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ImageUploadComponent } from "../../../../../shared/components/image-upload/image-upload.component";
import { notBlankValidator } from "../../../../../shared/util/validator-util";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";

@Component({
    selector: 'cliente-form',
    templateUrl: 'cliente-form.component.html',
    standalone: false
})
export class ClienteFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  stepperActiveIndex = 1;
  originalValue?: Cliente;

  @ViewChild('imageUpload') imageUpload!: ImageUploadComponent;

  constructor (
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private cepService: CepService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
      email: ['', Validators.compose([Validators.email, notBlankValidator])],
      endereco: this.fb.group({
        id: [undefined],
        cep: ['', Validators.compose([notBlankValidator()])],
        logradouro: ['', notBlankValidator()],
        numero: ['', notBlankValidator()],
        bairro: ['', notBlankValidator()],
        cidade: ['', notBlankValidator()],
        estado: ['', notBlankValidator()],
      }),
      matricula: ['', notBlankValidator()],
      limiteCompra: [0],
      dependentes: this.fb.array([])
    })

    this.configureCEPChanges();
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

  private configureForm(id?: number) {
    if(id){
      this.clienteService.findById(id).subscribe(foundClient => {
        this.setFoundClienteFormValue(foundClient)
      })
    }
  }

  private clearReferences() {
    this.imageUpload.clearReferences();
    this.originalValue = undefined;
  }

  private setFoundClienteFormValue(cliente: Cliente) {
    this.form.patchValue(cliente);
    this.imageUpload.defineImage(cliente.foto);
    this.originalValue = cliente;
  }

  public createDependenteForm() {
    return () => this.fb.group({
      id: new FormControl<number | undefined>(undefined),
      nome: ['', notBlankValidator()]
    })
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const cliente: Cliente = {...this.form.getRawValue(), foto: this.imageUpload.base64Image};

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, cliente);

      this.clienteService.update(cliente.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente editado com sucesso' });
        this.afterSave();
      });
    } else {
      this.clienteService.save(removeNullOrUndefinedProperties(cliente)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente salvo com sucesso' });
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

  get dependentes() {
    return <FormArray> this.form.get('dependentes');
  }

}

