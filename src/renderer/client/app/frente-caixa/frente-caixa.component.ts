import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table, TableEvents, TableStatus } from '../../../shared/model/table.model';
import { ProdutoService } from '../../../shared/services/produto.service';
import {Produto, ProdutoTag} from '../../../shared/model/produto.model';
import { ClienteService } from '../../../shared/services/cliente.service';
import { Cliente } from '../../../shared/model/cliente.model';
import { CondicaoPagamentoService } from '../../../shared/services/condicao-pagamento.service';
import { CondicaoPagamento } from '../../../shared/model/condicao-pagamento.model';
import { VendaService } from '../../../shared/services/venda.service';
import { CaixaStatus } from '../../../shared/enum/caixa-status.enum';
import { debounceTime, first, map, Subject, takeUntil } from 'rxjs';
import { VendaDraftService } from '../../../shared/services/venda-draft.service';
import { VendaDraft } from '../../../shared/model/venda-draft.model';
import {TagService} from '../../../shared/services/tag.service';
import {StatementSearchModel} from '../../../shared/model/statement-search.model';
import { AssociacaoService } from '../../../shared/services/associacao.service';
import { CondicaoPagamentoVenda, Venda } from '../../../shared/model/venda.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfiguracaoService } from '../../../shared/services/configuracao.service';

@Component({
  selector: 'frente-caixa',
  templateUrl: './frente-caixa.component.html',
  styleUrl: 'frente-caixa.component.scss',
  standalone: false,
})
export class FrenteCaixaComponent implements OnInit, OnDestroy {
  initialTables = 12;
  tables: Table[] = [];
  produtos: Produto[] = [];
  clientes: Cliente[] = [];
  condicoesPagamento: CondicaoPagamento[] = [];
  openedTable?: Table;
  produtoSearch = "";
  finalizandoVenda = false;
  showAddTable = true;
  tableStatusOptions = [
    { label: 'Todas', value: TableStatus.TODAS },
    { label: 'Disponível', value: TableStatus.DISPONIVEL },
    { label: 'Ocupada', value: TableStatus.OCUPADA }
  ];
  selectedTableStatus = TableStatus.TODAS;
  filteredTables: Table[] = [];
  status = CaixaStatus.FECHADO;
  vendasDrafts: VendaDraft[] = [];
  private readonly destroy$ = new Subject<void>();
  public tags: any[] = [];
  associacao?: any;
  @ViewChild('printSection') printSectionRef!: ElementRef;
  vendaToPrint?: Venda;

  constructor(
    private produtoService: ProdutoService,
    private clienteService: ClienteService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private vendaService: VendaService,
    private vendaDraftService: VendaDraftService,
    private tagService: TagService,
    private associacaoService: AssociacaoService,
    private ngZone: NgZone,
    private messageService: MessageService,
    private configuracaoService: ConfiguracaoService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {

    this.subscribeTableEvents();
    this.createInitialTables();
    this.findProdutos();
    this.findTags();
    this.findClientes();

    this.associacaoService.find().subscribe(associacao => {
      this.associacao = associacao;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeTableEvents() {
    TableEvents.update
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(500))
      .subscribe(table => {
        this.vendaDraftService.save(table.toVendaDraft).subscribe()
      });

    TableEvents.delete
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(500))
      .subscribe(table => {
        this.vendaDraftService.delete(table.id).subscribe()
      });
  }

  private createInitialTables() {
    this.vendaDraftService.findAll(1, 999)
      .pipe(map(page => page.content))
      .subscribe(vendasDrafts => {

        this.vendasDrafts = vendasDrafts;
        this.defineInitialTables();
        this.createTables();
    })
  }

  private defineInitialTables() {
    this.vendasDrafts.forEach(vendaDraft => {
      if(vendaDraft.id > this.initialTables) {
        this.initialTables = vendaDraft.id
      }
    })
  }

  private createTables() {
    for (let i = 1; i <= this.initialTables; i++) {
      this.createTable();
    }
  }

  createTable() {
    const index = this.tables.length;

    let table = new Table(index + 1);

    this.setDraftData(table);

    this.tables.push(table);

    if(index != 0){
      this.tables[index - 1].isLast = false;
    }

    this.filteredTables = [...this.tables];
  }

  private setDraftData(table: Table) {
    let draft = this.vendasDrafts.find(vendaDraft => vendaDraft.id == table.id);

    if(draft) {
      table.fromVendaDraft(draft)
    }
  }

  public findProdutos() {
    const search = this.produtoSearch.length ? `,nome=ilike=*${this.produtoSearch}*` : "";

    let tagsSearch: string[] = [];

    this.tags.filter(tag => tag.selected)
      .forEach(tag => {
        tagsSearch.push(`${tag.id}`)
      })

    const baseSearch: StatementSearchModel = {
      statement: `tipo==CANTINA${search}`,
      children: []
    }

    if(tagsSearch.length) {
      baseSearch.children.push({
          alias: 'tags',
          statement: `tag.id=in=(${tagsSearch.join(',')})`
        }
      )
    }

    this.produtoService.findAll(1, 25, baseSearch).subscribe(produtos => {
      this.produtos = produtos.content;
    })
  }

  private findTags() {
    this.tagService.findTagsFromCantina().subscribe(tags => {
      this.tags = tags.map((tag: any) => {
        tag['selected'] = false;
        return tag;
      })
    })
  }

  public filterByTag(tag: any) {
    tag.selected = !tag.selected;
    this.findProdutos();
  }

  public findClientes(search = "") {
    search = search.length ? `nome=ilike=*${search}*` : "";

    this.clienteService.findAll(1, 10, search).subscribe(clientes => {
      this.clientes = clientes.content;
    })
  }

  public findCondicoesPagamento(search = "") {
    search = search.length ? `,nome=ilike=*${search}*` : "";
    let condicoesSelecionadas = this.openedTable!.condicoesPagamento
      .filter(condicaoVenda => condicaoVenda.condicaoPagamento)
      .map(condicaoVenda => condicaoVenda.condicaoPagamento?.id);

    const condicaoNotInFilter = condicoesSelecionadas.length ? `,id=notin=(${condicoesSelecionadas.join(',')})` : "";

    let finalSearch = `ativa==true${condicaoNotInFilter}${search}`;

    this.condicaoPagamentoService.findAll(1, 10, finalSearch).subscribe(condicoesPagamento => {
      this.condicoesPagamento = condicoesPagamento.content;
    })
  }

  public openTable(table: Table) {
    table.open();
    this.openedTable = table;
  }

  public get isTableOpened() {
    return !!this.openedTable;
  }

  public collapseTable() {
    if(this.openedTable?.isEmpty) {
      this.openedTable?.close();
    }

    this.openedTable = undefined;
    this.cancelarFinalizacaoVenda();
  }

  public cancelarVenda() {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja cancelar a venda?',
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
        this.resetTable();
      }
    });
  }

  public addProduto(produto: Produto) {
    this.openedTable?.addItem(produto);
  }

  public removeProduto(produto: Produto) {
    this.openedTable?.removeItem(produto);
  }

  iniciarFinalizacaoVenda() {
    this.finalizandoVenda = true;
  }

  cancelarFinalizacaoVenda() {
    this.finalizandoVenda = false;
  }

  public finalizarVenda() {
    this.vendaService.save(this.openedTable!.toVenda).subscribe((venda) => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda registrada com sucesso.' });

      if(this.openedTable?.obrigadoInformarCliente) {
        this.configuracaoService.findAll()
          .pipe(map(page => page.content))
          .subscribe(configuracao => {
            if(configuracao[0].gerarComprovanteVenda) {
              this.print(venda);
            }
          })
      }

      this.resetTable();
    })
  }

  private resetTable() {
    this.finalizandoVenda = false;
    this.openedTable?.close();
    this.openedTable = undefined;
  }

  changeCondicaoPagamento(condicaoPagamento: CondicaoPagamento, condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    let dates = this.condicaoPagamentoService.generateDates(condicaoPagamento);
    this.openedTable?.setCondicaoPagamento(condicaoPagamento, condicaoPagamentoVenda, dates);
  }

  changeCondicaoPagamentoValor(valor: number, condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    this.openedTable?.setCondicaoPagamentoValor(valor, condicaoPagamentoVenda);
  }

  filterTablesByStatus() {
    if (this.selectedTableStatus === TableStatus.TODAS) {
      this.filteredTables = [...this.tables];
      this.showAddTable = true;
    } else {
      if (this.selectedTableStatus === TableStatus.DISPONIVEL) {
        this.filteredTables = this.tables.filter(table => table.isDisponivel);
      } else if (this.selectedTableStatus === TableStatus.OCUPADA) {
        this.filteredTables = this.tables.filter(table => table.isOcupada);
      }

      this.showAddTable = false;
    }
  }

  public deleteTable(event: Event) {
    event.stopPropagation();

    const lastTable = this.getLastTable();

    if(lastTable.isOcupada) {
      return;
    }

    this.tables.pop();

    if(this.tables.length){
      this.getLastTable().isLast = true;
    }

    this.filteredTables = [...this.tables];
  }

  private getLastTable() {
    return this.tables[this.tables.length - 1];
  }

  addCondicaoPagamento() {
    this.openedTable?.addCondicaoPagamento();
  }

  removeCondicaoPagamento(condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    this.openedTable?.removeCondicaoPagamento(condicaoPagamentoVenda);
  }


  private print(venda: Venda) {
    this.vendaToPrint = venda;

    this.ngZone.onStable
      .pipe(first())
      .subscribe(() => this.internalPrint());
  }

  private internalPrint() {
    if(!this.vendaToPrint) return;

    const printContents = this.printSectionRef.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');

    if(!popupWin) return;

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <style>
            body {
                font-family: Arial, sans-serif;
                padding: 0;
                width: 80mm;
                margin: auto;
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
        this.vendaToPrint = undefined;
      }
    }, 500);
  }

}
