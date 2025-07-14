import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { FornecedorService } from "../../../../../shared/services/fornecedor.service";
import { Fornecedor } from "../../../../../shared/model/fornecedor.model";
import {ContaPagar} from '../../../../../shared/model/conta-pagar.model';
import { ContaPagarService } from '../../../../../shared/services/conta-pagar.service';
import { DateFormatPipe } from '../../../../../shared/pipe/date-format.pipe';

@Component({
    selector: 'conta-pagar-form',
    templateUrl: 'conta-pagar-form.component.html',
    standalone: false
})
export class ContaPagarFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: ContaPagar;
  fornecedoresSelect: Fornecedor[] = []

  constructor (
    private contaPagarService: ContaPagarService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fornecedorService: FornecedorService,
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.isVisibleChange){
      this.isVisibleChange.subscribe(id => {
        this.createForm();
        this.isVisible = true;
        this.configureForm(id);
      })
    }
  }

  private createForm() {
    this.form = this.fb.group({
      id: [undefined],
      fornecedor: [null, Validators.required],
      valor: [0.01, Validators.compose([Validators.min(0.01), Validators.required])],
      dataVencimento: [null, Validators.required],
      paga: []
    })

  }

  private configureForm(id?: number) {
    if(id){
      this.contaPagarService.findById(id).subscribe(foundContaPagar => {
        this.setFoundContaPagarFormValue(foundContaPagar)
      })
    }
  }

  private setFoundContaPagarFormValue(contaPagar: ContaPagar) {
    contaPagar.dataVencimento = new DateFormatPipe().transform(contaPagar.dataVencimento);

    this.form.patchValue(contaPagar);
    this.originalValue = contaPagar;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const contaPagar: ContaPagar = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, contaPagar);

      this.contaPagarService.update(contaPagar.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Pagar editada com sucesso' });
        this.afterSave();
      });
    } else {
      this.contaPagarService.save(removeNullOrUndefinedProperties(contaPagar)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Pagar salva com sucesso' });
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

  private clearReferences() {
    this.originalValue = undefined;
  }

  searchFornecedores(event: AutoCompleteCompleteEvent) {
    this.fornecedorService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(fornecedores => {
      this.fornecedoresSelect = fornecedores.content;
    })
  }

}
