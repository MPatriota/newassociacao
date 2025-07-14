import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { notBlankValidator } from "../../../../../shared/util/validator-util";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { CondicaoPagamento } from "../../../../../shared/model/condicao-pagamento.model";
import { CondicaoPagamentoService } from "../../../../../shared/services/condicao-pagamento.service";

@Component({
    selector: 'condicao-pagamento-form',
    templateUrl: 'condicao-pagamento-form.component.html',
    standalone: false
})
export class CondicaoPagamentoFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: CondicaoPagamento;

  constructor (
    private condicaoPagamentoService: CondicaoPagamentoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
      nome: ['', Validators.compose([notBlankValidator(), Validators.maxLength(100)])],
      parcelas: [0, Validators.compose([Validators.required, Validators.min(0)])],
      intervalo: [0, Validators.compose([Validators.required, Validators.min(0)])],
      vencimento: [0, Validators.compose([Validators.required, Validators.min(0)])],
      descricao: ['', Validators.maxLength(200)],
      ativa: [true, Validators.required],
      obrigadoInformarCliente: [false, Validators.required],
      aVista: [false, Validators.required]
    })

    this.form.get('aVista')?.valueChanges.subscribe(value => {
      let parcelas = this.form.get('parcelas');
      let intervalo = this.form.get('intervalo');
      let vencimento = this.form.get('vencimento');

      if(value) {
        parcelas?.patchValue(0);
        parcelas?.disable();

        intervalo?.patchValue(0);
        intervalo?.disable();

        vencimento?.patchValue(0);
        vencimento?.disable();
      } else {
        parcelas?.enable();
        intervalo?.enable();
        vencimento?.enable();
      }
    })
  }

  private configureForm(id?: number) {
    if(id){
      this.condicaoPagamentoService.findById(id).subscribe(foundCondicaoPagamento => {
        this.setFoundCondicaoPagamentoFormValue(foundCondicaoPagamento)
      })
    }
  }

  private clearReferences() {
    this.originalValue = undefined;
  }

  private setFoundCondicaoPagamentoFormValue(condicaoPagamento: CondicaoPagamento) {
    this.form.patchValue(condicaoPagamento);
    this.originalValue = condicaoPagamento;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    const condicaoPagamento: CondicaoPagamento = this.form.getRawValue();

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, condicaoPagamento);

      this.condicaoPagamentoService.update(condicaoPagamento.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição de Pagamento editada com sucesso' });
        this.afterSave();
      });
    } else {
      this.condicaoPagamentoService.save(removeNullOrUndefinedProperties(condicaoPagamento)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição de Pagamento salva com sucesso' });
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
}
