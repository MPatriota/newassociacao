import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { ClienteService } from "../../../../../shared/services/cliente.service";
import { Cliente } from "../../../../../shared/model/cliente.model";
import { ContaReceber } from '../../../../../shared/model/conta-receber.model';
import { DateFormatPipe } from '../../../../../shared/pipe/date-format.pipe';
import { ContaReceberService } from '../../../../../shared/services/conta-receber.service';

@Component({
  selector: 'conta-receber-form',
  templateUrl: 'conta-receber-form.component.html',
  standalone: false
})
export class ContaReceberFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: ContaReceber;
  clientesSelect: Cliente[] = []

  constructor (
    private contaReceberService: ContaReceberService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
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
      cliente: [null, Validators.required],
      valor: [0.01, Validators.compose([Validators.min(0.01), Validators.required])],
      dataVencimento: [null, Validators.required],
      descricao: [""],
      paga: []
    })

  }

  private configureForm(id?: number) {
    if(id){
      this.contaReceberService.findById(id).subscribe(foundContaReceber => {
        this.setFoundContaReceberFormValue(foundContaReceber)
      })
    }
  }

  private setFoundContaReceberFormValue(contaReceber: ContaReceber) {
    contaReceber.dataVencimento = new DateFormatPipe().transform(contaReceber.dataVencimento);

    this.form.patchValue(contaReceber);
    this.originalValue = contaReceber;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const contaReceber: ContaReceber = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, contaReceber);

      this.contaReceberService.update(contaReceber.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Receber editada com sucesso' });
        this.afterSave();
      });
    } else {
      this.contaReceberService.save(removeNullOrUndefinedProperties(contaReceber)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta a Receber salva com sucesso' });
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

  searchClientes(event: AutoCompleteCompleteEvent) {
    this.clienteService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(clientes => {
      this.clientesSelect = clientes.content;
    })
  }

}
