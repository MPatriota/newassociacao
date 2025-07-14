import { Component, ElementRef, EventEmitter, NgZone, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../../../../shared/model/page.model';
import { PageParameter } from '../../../../../shared/model/page-parameter';
import { ConfirmationService, MessageService } from 'primeng/api';
import {StatementSearchModel} from '../../../../../shared/model/statement-search.model';
import { getOperations } from '../../../../../shared/util/json.util';
import moment, { Moment } from 'moment';
import { DateService } from '../../../../../shared/services/date.service';
import { AgendamentoQuiosque } from '../../../../../shared/model/agendamento-quiosque.model';
import { AgendamentoQuiosqueService } from '../../../../../shared/services/agendamento-quiosque.service';
import { Quiosque } from '../../../../../shared/model/quiosque.model';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { QuiosqueService } from '../../../../../shared/services/quiosque.service';
import { Cliente } from '../../../../../shared/model/cliente.model';
import { ClienteService } from '../../../../../shared/services/cliente.service';
import { AssociacaoService } from '../../../../../shared/services/associacao.service';
import { first } from 'rxjs';

@Component({
  selector: 'agendamento-quiosque-list',
  templateUrl: "agendamento-quiosque-list.component.html",
  standalone: false
})
export class AgendamentoQuiosqueListComponent implements OnInit {

  page: Page<AgendamentoQuiosque> | null = null;
  pageParameters: PageParameter = new PageParameter();
  searchValue = "";
  search = this.defaultSearch();
  formVisibleChange = new EventEmitter<number | undefined>;
  advancedFilters = this.defaultAdvancedFilters;
  quiosqueSelect: Quiosque[] = []
  clientesSelect: Cliente[] = []
  agendamentoToPrint?: AgendamentoQuiosque;

  get defaultAdvancedFilters() {
    return {
      dataAgendamentoInicial: { value: "", callback: (value: any) => `data>=${value}`},
      dataAgendamentoFinal: { value: "", callback: (value: any) => `data<=${value}`},
      quiosque: { value: undefined, callback: (quiosque: Quiosque) => {
          return `nome==${quiosque.nome}`}
      },
      cliente: { value: undefined, callback: (cliente: Cliente) => {
          return `id==${cliente.id}`}
      },
    };
  }

  constructor(
    private agendamentoQuiosqueService: AgendamentoQuiosqueService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dateService: DateService,
    private quiosqueService: QuiosqueService,
    private clienteService: ClienteService,
    private associacaoService: AssociacaoService,
    private ngZone: NgZone,
  ) {}

  associacao?: any;
  @ViewChild('printSection') printSectionRef!: ElementRef;
  @ViewChild('printSectionSalao') printSectionSalaoRef!: ElementRef;
  @ViewChild('printSectionConferencia') printSectionConferenciaRef!: ElementRef;

  ngOnInit() {
    this.fetch();

    this.associacaoService.find().subscribe(associacao => {
      this.associacao = associacao;
    })
  }

  private fetch() {
    this.agendamentoQuiosqueService.findAll(this.pageParameters.page,
      this.pageParameters.limit, this.search).subscribe(page => this.page = page);
  }

  clickNew() {
    this.formVisibleChange.emit();
  }

  onSearch(searchValue: any) {
    this.searchValue = searchValue;
    this.applyAdvancedFilters();
  }

  loadData(page: PageParameter) {
    this.pageParameters = page;
    this.fetch();
  }

  edit(agendamentoQuiosque: AgendamentoQuiosque) {
    if(!agendamentoQuiosque.id){
      return;
    }

    this.formVisibleChange.emit(agendamentoQuiosque.id);
  }

  delete(agendamentoQuiosque: AgendamentoQuiosque) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja excluir o Agendamento de Quiosque?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Deletar',
        severity: 'danger',
      },
      accept: () => {
        if(!agendamentoQuiosque.id){
          return;
        }

        this.agendamentoQuiosqueService.delete(agendamentoQuiosque.id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento de Quiosque excluído com sucesso.' });
          this.fetch();
        });
      }
    });
  }

  onSave() {
    this.fetch();
  }

  confirmarAgendamento(agendamentoQuiosque: AgendamentoQuiosque) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Você tem certeza que deseja confirmar esse Agendamento de Quiosque?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'success',
      },
      accept: () => this.realizarConfirmacao(agendamentoQuiosque)
    });
  }

  private realizarConfirmacao(agendamentoQuiosque: AgendamentoQuiosque) {
    if(!agendamentoQuiosque.id){
      return;
    }

    const operations = getOperations(agendamentoQuiosque, {...agendamentoQuiosque, confirmado: true, dataConfirmacao: this.dateService.getCurrentDate()});

    this.agendamentoQuiosqueService.update(agendamentoQuiosque.id, operations).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento confirmado com sucesso.' });
      this.fetch();
    });
  }

  clearFilters() {
    this.advancedFilters = this.defaultAdvancedFilters;
    this.applyAdvancedFilters();
  }

  applyAdvancedFilters() {

    let defaultSearch = this.defaultSearch();

    const advancedFilters: string[] = [];

    Object.keys(this.advancedFilters).forEach((key: any) => {

      // @ts-ignore
      const filter: any = this.advancedFilters[key];

      if(filter.value == null) {
        return;
      }

      if (typeof filter.value == 'number' || filter.value?.length > 0) {
        advancedFilters.push(filter.callback(filter.value));
      }

      if(typeof filter.value == 'object') {
        defaultSearch.children.push({
          statement: filter.callback(filter.value),
          alias: key
        })
      }

    });

    defaultSearch.statement = advancedFilters.join(',');

    this.search = defaultSearch;
    this.loadData(new PageParameter());
  }

  private defaultSearch(): StatementSearchModel {
    return {
      statement: "",
      children: [
        {
          statement: `nome=ilike=*${this.searchValue}*`,
          alias: 'quiosque'
        }
      ]
    }
  }

  formatDate(date: Date) {
    if(!date) {
      return '';
    }

    return moment(date).format('YYYY-MM-DD');
  }

  searchQuiosques(event: AutoCompleteCompleteEvent) {

    if(this.advancedFilters.quiosque.value) {
      this.quiosqueSelect = [this.advancedFilters.quiosque.value];
      return;
    }

    this.quiosqueService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(quiosques => {
      this.quiosqueSelect = quiosques.content;
    })
  }

  searchClientes(event: AutoCompleteCompleteEvent) {
    if(this.advancedFilters.cliente.value) {
      this.clientesSelect = [this.advancedFilters.cliente.value];
      return;
    }

    this.clienteService.findAll(1, 10, `nome=ilike=*${event.query}*`).subscribe(clientes => {
      this.clientesSelect = clientes.content;
    })
  }

  dataAtual?: Moment;
  dataAgendamento?: Moment;
  horaInicio?: Moment;
  horaFim?: Moment;

  meses = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro'
  };

  diasSemana = {
    1: "Segunda-feira",
    2: "Terça-feira",
    3: "Quarta-feira",
    4: "Quinta-feira",
    5: "Sexta-feira",
    6: "Sábado",
    7: "Domingo"
  }

  mes(index: any) {

    if(!index) {
      return;
    }
    // @ts-ignore
    return this.meses[index + 1];
  }

  diaSemana(index?: number) {
    if(!index) {
      return;
    }
    // @ts-ignore
    return this.diasSemana[index];
  }

  print(agendamento: AgendamentoQuiosque) {
    this.agendamentoToPrint = agendamento;

    this.dataAtual = moment();
    this.dataAgendamento = moment(this.agendamentoToPrint.data);
    this.horaInicio = moment(this.agendamentoToPrint.horaInicio, "HH:mm");
    this.horaFim = moment(this.agendamentoToPrint.horaFim, "HH:mm");

    this.ngZone.onStable
      .pipe(first())
      .subscribe(() => this.internalPrint());
  }

  printConferenciaUtensilios(agendamento: AgendamentoQuiosque) {
    this.agendamentoToPrint = agendamento;

    this.ngZone.onStable
      .pipe(first())
      .subscribe(() => this.internalPrintConferencia());
  }

  private internalPrint() {
    if(!this.agendamentoToPrint) return;

    let printContents;

    if(this.agendamentoToPrint.quiosque.salao) {
      printContents = this.printSectionSalaoRef.nativeElement.innerHTML;
    } else {
      printContents = this.printSectionRef.nativeElement.innerHTML;
    }

    const popupWin = window.open('', '_blank', 'width=800,height=600');

    if(!popupWin) return;

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <style>
            body {
              font-family: "Times New Roman", serif;
              margin: 10px 40px;
              font-size: 11pt;
              color: #000;
            }
            h1, h2, .assinaturas p, .testemunhas p, .local-data p, .assinatura p {
              text-align: center;
              margin: 0;
            }
            h2 {
              text-transform: uppercase;
              margin-top: 20px;
            }
            p, .clausula {
              text-align: justify;
            }
            .local-data {
              margin-top: 20px;
            }
            .campo {
              margin-bottom: 10px;
            }
            .observacoes {
              margin-top: 30px;
            }
            .page-break {
              page-break-before: always;
            }
        </style>
        </head>
        <body
            onload="window.print();
            window.close()">
          ${printContents}
        </body>
      </html>
    `);
    popupWin?.document.close();

    const checkInterval = setInterval(() => {
      if (popupWin?.closed) {
        clearInterval(checkInterval);
        this.agendamentoToPrint = undefined;
      }
    }, 500);
  }

  private internalPrintConferencia() {
    if(!this.agendamentoToPrint) return;

    const printContents = this.printSectionConferenciaRef.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');

    if(!popupWin) return;

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <style>
            body {
              font-family: "Times New Roman", serif;
              margin: 10px 40px;
              font-size: 11pt;
              color: #000;
            }
            h1, h2, .assinaturas p, .testemunhas p, .local-data p, .assinatura p {
              text-align: center;
              margin: 0;
            }
            h2 {
              text-transform: uppercase;
              margin-top: 20px;
            }
            p, .clausula {
              text-align: justify;
            }
            .local-data {
              margin-top: 20px;
            }
            .campo {
              margin-bottom: 10px;
            }
            .observacoes {
              margin-top: 30px;
            }
            .page-break {
              page-break-before: always;
            }
        </style>
        </head>
        <body
            onload="window.print();
            window.close()">
          ${printContents}
        </body>
      </html>
    `);
    popupWin?.document.close();

    const checkInterval = setInterval(() => {
      if (popupWin?.closed) {
        clearInterval(checkInterval);
        this.agendamentoToPrint = undefined;
      }
    }, 500);
  }

  protected readonly moment = moment;
}
