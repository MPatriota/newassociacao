import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormGroup, ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import { ConfirmationService, MessageService } from "primeng/api";
import { getOperations, removeNullOrUndefinedProperties } from "../../../../../shared/util/json.util";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { ClienteService } from "../../../../../shared/services/cliente.service";
import { Cliente } from "../../../../../shared/model/cliente.model";
import { AgendamentoQuiosque } from '../../../../../shared/model/agendamento-quiosque.model';
import { DateFormatPipe } from '../../../../../shared/pipe/date-format.pipe';
import { AgendamentoQuiosqueService } from '../../../../../shared/services/agendamento-quiosque.service';
import { Quiosque } from '../../../../../shared/model/quiosque.model';
import { QuiosqueService } from '../../../../../shared/services/quiosque.service';
import moment from 'moment';
import { notBeforeToday } from '../../../../../shared/util/validator-util';
import { CurrencyFormatPipe } from '../../../../../shared/pipe/currency-format.pipe';
import { ContaReceber } from '../../../../../shared/model/conta-receber.model';
import { DateService } from '../../../../../shared/services/date.service';

@Component({
  selector: 'agendamento-quiosque-form',
  templateUrl: 'agendamento-quiosque-form.component.html',
  standalone: false
})
export class AgendamentoQuiosqueFormComponent implements OnInit {

  @Input() isVisibleChange!: EventEmitter<number | undefined>;
  @Output() onSave = new EventEmitter<void>;

  form!: FormGroup;
  isVisible = false;
  originalValue?: AgendamentoQuiosque;
  clientesSelect: Cliente[] = []
  quiosqueSelect: Quiosque[] = []
  agendamentosByQuiosque: AgendamentoQuiosque[] = [];
  showAgendamentos = false;
  stepperActiveIndex = 1;
  contasReceberChildren: ContaReceber[] = [];

  constructor (
    private agendamentoQuiosqueService: AgendamentoQuiosqueService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
    private quiosqueService: QuiosqueService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.isVisibleChange){
      this.isVisibleChange.subscribe(id => {
        this.createForm();
        this.isVisible = true;
        this.stepperActiveIndex = 1;
        this.contasReceberChildren = [];
        this.configureForm(id);
      })
    }
  }

  private createForm() {
    this.form = this.fb.group({
      id: [undefined],
      quiosque: [undefined, Validators.required],
      cliente: [undefined, Validators.required],
      data: [{ value: undefined, disabled: true }, Validators.compose([Validators.required, notBeforeToday(this.dateService.getCurrentDate())])],
      horaInicio: [{ value: undefined, disabled: true }, Validators.compose([Validators.required, this.horaInicioValidator()])],
      horaFim: [{ value: undefined, disabled: true }, Validators.compose([Validators.required, this.horaFimValidator()])],
      valor: [{ value: 0, disabled: true }, Validators.required],
      descricao: [undefined],
      contasReceber: this.fb.array([])
    })

    this.quiosqueControl?.valueChanges.subscribe((value: Quiosque) => {
      if(!value) {
        this.dataControl?.patchValue(undefined);
        this.dataControl?.disable();
        this.valorControl?.patchValue(0);
      } else {
        this.dataControl?.enable();
        this.valorControl?.patchValue(value.valorAluguel);
        this.createContaReceber();
      }
    })

    this.dataControl?.valueChanges.subscribe(value => {
      if(!value || this.dataControl?.invalid) {
        this.horaInicioControl?.patchValue(undefined);
        this.horaInicioControl?.disable();

        this.horaFimControl?.patchValue(undefined);
        this.horaFimControl?.disable();

        this.agendamentosByQuiosque = [];
        this.showAgendamentos = false;
      } else {
        this.horaInicioControl?.enable();
        this.horaFimControl?.enable();

        this.showAgendamentos = true;
        this.findAgendamentosByQuiosque();

        this.createContaReceber();
      }
    })

    this.horaInicioControl?.valueChanges.subscribe(value => {
      this.validarAgendamento();
    })

    this.horaFimControl?.valueChanges.subscribe(value => {
      this.validarAgendamento();
    })

    this.contasReceberFormArray.clear();
  }

  private get quiosqueControl() {
    return this.form.get('quiosque');
  }

  private get idControl() {
    return this.form.get('id');
  }

  private get clienteControl() {
    return this.form.get('cliente');
  }

  private get dataControl() {
    return this.form.get('data');
  }

  private get horaInicioControl() {
    return this.form.get('horaInicio');
  }

  private get horaFimControl() {
    return this.form.get('horaFim');
  }

  private get valorControl() {
    return this.form.get('valor');
  }

  private findAgendamentosByQuiosque() {
    let id = this.idControl?.value;
    let quiosque: Quiosque = this.quiosqueControl?.value;
    let data: Date = this.dataControl?.value;

    if(quiosque.id) {
      this.agendamentoQuiosqueService.findByQuiosque(quiosque.id, data).subscribe(agendamentos => {
        this.agendamentosByQuiosque = agendamentos.filter(agendamento => agendamento.id != id);
      })
    }

  }

  private horaInicioValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value === null || control.value === undefined || !this.horaFimControl?.value) {
        return null;
      }

      const isAfterHoraFim = moment(control.value, "HH:mm").isAfter(moment(this.horaFimControl.value, "HH:mm"));

      return isAfterHoraFim ? { 'genericMessage': "A hora de início não pode ser maior que a hora final" } : null;
    };
  }

  private horaFimValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value === null || control.value === undefined || !this.horaInicioControl?.value) {
        return null;
      }

      const isBeforeHoraInicio = moment(control.value, "HH:mm").isBefore(moment(this.horaInicioControl.value, "HH:mm"));

      return isBeforeHoraInicio ? { 'genericMessage': "A hora final não pode ser menor que a hora de início" } : null;
    };
  }

  private validarAgendamento() {
    if(this.horaInicioControl?.invalid || this.horaFimControl?.invalid) {
      return;
    }

    const horaInicio = moment(moment(this.horaInicioControl?.value).format("HH:mm"), "HH:mm");
    const horaFim = moment(moment(this.horaFimControl?.value).format("HH:mm"), "HH:mm");

    this.agendamentosByQuiosque.forEach(agendamento => {
      const horaInicioAgendamento = moment(agendamento.horaInicio, "HH:mm");
      const horaFimAgendamento = moment(agendamento.horaFim, "HH:mm");

      const horaInicioIsAfter = horaInicio.isSameOrAfter(horaInicioAgendamento);
      const horaInicioIsBefore = horaInicio.isBefore(horaFimAgendamento);

      const horaFimIsAfter = horaFim.isAfter(horaInicioAgendamento);
      const horaFimIsBefore = horaFim.isSameOrBefore(horaFimAgendamento);

      const horaInicioAgendamentoIsAfter = horaInicioAgendamento.isSameOrAfter(horaInicio);
      const horaInicioAgendamentoIsBefore = horaInicioAgendamento.isBefore(horaFim);

      const horaFimAgendamentoIsAfter = horaFimAgendamento.isAfter(horaInicio);
      const horaFimAgendamentoIsBefore = horaFimAgendamento.isSameOrBefore(horaFim);

      if(
        (horaInicioIsAfter && horaInicioIsBefore) ||
        (horaFimIsAfter && horaFimIsBefore) ||
        (horaInicioAgendamentoIsAfter && horaInicioAgendamentoIsBefore) ||
        (horaFimAgendamentoIsAfter && horaFimAgendamentoIsBefore)
      ) {
        // @ts-ignore
        agendamento['error'] = true;
      } else {
        // @ts-ignore
        agendamento['error'] = false;
      }
    })

  }

  private validarHoraInicio() {
    if(this.horaInicioControl?.value) {
      this.horaInicioControl.updateValueAndValidity({emitEvent: false});
    }
  }

  private validarHoraFim() {
    if(this.horaFimControl?.value) {
      this.horaFimControl.updateValueAndValidity({emitEvent: false});
    }
  }

  get agendamentoHasError() {
    // @ts-ignore
    return this.agendamentosByQuiosque.some(agendamento => agendamento['error'])
  }

  private configureForm(id?: number) {
    if(id){
      this.agendamentoQuiosqueService.findById(id).subscribe(foundAgendamentoQuiosque => {
        this.setFoundAgendamentoQuiosqueFormValue(foundAgendamentoQuiosque)
      })
    }
  }

  private setFoundAgendamentoQuiosqueFormValue(agendamentoQuiosque: AgendamentoQuiosque) {
    agendamentoQuiosque.data = new DateFormatPipe().transform(agendamentoQuiosque.data);

    this.form.patchValue({
      ...agendamentoQuiosque,
      horaInicio: moment(agendamentoQuiosque.horaInicio, "HH:mm:00").toDate(),
      horaFim: moment(agendamentoQuiosque.horaFim, "HH:mm:00").toDate()
    });

    this.contasReceberFormArray.clear();

    this.originalValue = agendamentoQuiosque;
    this.contasReceberChildren = agendamentoQuiosque.contasReceber;
  }

  save() {
    if(this.form.invalid){
      return;
    }

    let agendamentoQuiosqueToSave: AgendamentoQuiosque = this.form.getRawValue();

    const agendamentoQuiosque: AgendamentoQuiosque = {
      ...agendamentoQuiosqueToSave,
      horaInicio: moment(agendamentoQuiosqueToSave.horaInicio).format("HH:mm"),
      horaFim: moment(agendamentoQuiosqueToSave.horaFim).format("HH:mm"),
    };

    if(this.originalValue) {
      const operations = getOperations(this.originalValue, agendamentoQuiosque);

      this.agendamentoQuiosqueService.update(agendamentoQuiosque.id!, operations).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento de Quiosque editado com sucesso' });
        this.afterSave();
      });
    } else {
      this.agendamentoQuiosqueService.save(removeNullOrUndefinedProperties(agendamentoQuiosque)).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento de Quiosque salvo com sucesso' });
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
    this.showAgendamentos = false;
    this.agendamentosByQuiosque = [];
  }

  searchClientes(event: AutoCompleteCompleteEvent) {
    if(this.clienteControl?.value) {
      this.clientesSelect = [this.clienteControl?.value];
      return;
    }

    this.clienteService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(clientes => {
      this.clientesSelect = clientes.content;
    })
  }

  searchQuiosques(event: AutoCompleteCompleteEvent) {

    if(this.quiosqueControl?.value) {
      this.quiosqueSelect = [this.quiosqueControl?.value];
      return;
    }

    this.quiosqueService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(quiosques => {
      this.quiosqueSelect = quiosques.content;
    })
  }

  quioqueLabel(quiosque: Quiosque) {
    return `${quiosque.nome} - Capacidade: ${quiosque.capacidadeMaxima} - Valor de aluguel ${new CurrencyFormatPipe().transform(quiosque.valorAluguel)}`
  }

  clienteLabel(cliente: Cliente) {
    return `${cliente.nome} - Matrícula: ${cliente.matricula} - Limite de Compra ${new CurrencyFormatPipe().transform(cliente.limiteCompra)}`
  }

  get contasReceberFormArray() {
    return <FormArray> this.form.get('contasReceber');
  }

  createContaReceberForm() {
    const quiosque: Quiosque | undefined = this.quiosqueControl?.value;
    let data: Date = this.dataControl?.value && moment(this.dataControl?.value, 'DD/MM/YYYY').toDate();

    const descricao = quiosque && `Reserva do Quiosque [${quiosque.nome}] em [${new DateFormatPipe().transform(data)}]`;

    return () => this.fb.group({
      id: [undefined],
      cliente: [this.clienteControl?.value, Validators.required],
      valor: [this.valorControl?.value, Validators.compose([Validators.min(0.01), Validators.required])],
      dataVencimento: [data, Validators.required],
      descricao: [descricao],
      paga: []
    })
  }

  createContaReceber() {
    if(this.idControl?.value) {
      return;
    }

    if(this.quiosqueControl?.value && this.dataControl?.value && this.clienteControl?.value) {
      this.contasReceberFormArray.clear();

      let contaReceberForm = this.createContaReceberForm()();

      this.contasReceberFormArray.push(contaReceberForm);
    }
  }
}
