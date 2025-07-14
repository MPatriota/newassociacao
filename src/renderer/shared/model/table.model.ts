import {Produto} from './produto.model';
import {Cliente} from './cliente.model';
import { CondicaoPagamento } from './condicao-pagamento.model';
import { CondicaoPagamentoVenda, Venda, VendaItem } from './venda.model';
import { ContaReceber } from './conta-receber.model';
import { VendaDraft, VendaItemDraft } from './venda-draft.model';
import { EventEmitter } from '@angular/core';

export enum TableStatus {
  TODAS = "Todas",
  DISPONIVEL = "Disponível",
  OCUPADA = "Ocupada",
}

export class TableEvents {
  static readonly update = new EventEmitter<Table>();
  static readonly delete = new EventEmitter<Table>();
}

export class Table {
  readonly id: number;
  private status = TableStatus.DISPONIVEL;
  private readonly _items: Item[] = [];
  private _cliente?: Cliente;
  private _condicoesPagamento: CondicaoPagamentoVenda[] = [];
  condicaoPagamentoRowId = 0;
  isLast = true;
  errorCliente = false;

  constructor(id: number) {
    this.id = id;
    this.addCondicaoPagamento();
  }

  get isDisponivel() {
    return this.status === TableStatus.DISPONIVEL;
  }

  get isOcupada() {
    return !this.isDisponivel;
  }

  get items() {
    return this._items;
  }

  get total() {
    return this._items.reduce((total, item) => total + item.subtotal, 0);
  }

  public open() {
    this.status = TableStatus.OCUPADA;
  }

  public close() {
    this.status = TableStatus.DISPONIVEL;
    this._items.length = 0;
    this._cliente = undefined;
    this._condicoesPagamento = [];
    this.addCondicaoPagamento();
    TableEvents.delete.emit(this);
  }

  public addItem(produto: Produto) {
    let foundItem = this.findItem(produto);

    if(!foundItem) {
      this._items.push(this.createItem(produto, 1));
    } else {
      foundItem.increment();
    }

    TableEvents.update.emit(this);
  }

  private createItem(produto: Produto, quantidade: number) {
    const item = new Item(produto, quantidade);

    item.updateEmitter = () => TableEvents.update.emit(this);

    return item;
  }

  private findItem(produto: Produto) {
    return this._items.find(item => item.produto.id === produto.id);
  }

  get isEmpty() {
    return this._items.length === 0;
  }

  public removeItem(produto: Produto) {
    const itemIndex = this.findItemIndex(produto);

    if(itemIndex > -1) {
      this._items.splice(itemIndex, 1);
    }

    if(this.isEmpty) {
      TableEvents.delete.emit(this);
    } else {
      TableEvents.update.emit(this);
    }
  }

  private findItemIndex(produto: Produto) {
    return this._items.findIndex(item => item.produto.id === produto.id);
  }

  public setCondicaoPagamento(condicaoPagamento: CondicaoPagamento, condicaoPagamentoVenda: CondicaoPagamentoVenda, dates: Date[]) {
    condicaoPagamentoVenda.condicaoPagamento = condicaoPagamento;
    condicaoPagamentoVenda.datasContasReceber = dates;

    this.generateContasReceberIfNecessary(condicaoPagamentoVenda);

    if(this.obrigadoInformarCliente && !this._cliente) {
      this.errorCliente = true;
    } else {
      this.errorCliente = false;
    }
  }

  public setCondicaoPagamentoValor(valor: number, condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    condicaoPagamentoVenda.valor = valor;
    condicaoPagamentoVenda.pristine = false;
    this.generateContasReceberIfNecessary(condicaoPagamentoVenda);
  }

  public generateContasReceberIfNecessary(condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    const condicaoPagamento = condicaoPagamentoVenda.condicaoPagamento;

    if(this._cliente && !condicaoPagamento?.aVista && condicaoPagamento?.parcelas && condicaoPagamentoVenda.valor){
      this.generateContasReceber(condicaoPagamentoVenda);
    } else {
      condicaoPagamentoVenda.contasReceber.length = 0;
    }
  }

  private generateContasReceber(condicaoPagamentoVenda: CondicaoPagamentoVenda) {
    const contasReceber: ContaReceber[] = [];

    const valorParcela = condicaoPagamentoVenda.valor / condicaoPagamentoVenda.condicaoPagamento!.parcelas;

    for (let date of condicaoPagamentoVenda.datasContasReceber) {
      contasReceber.push({
        cliente: this.cliente,
        valor: valorParcela,
        dataVencimento: date,
        descricao: ""
      })
    }

    condicaoPagamentoVenda.contasReceber = contasReceber;
  }

  get toVenda(): Venda {
    return {
      cliente: this.cliente,
      items: this.items.map(item => item.toVendaItem),
      total: this.total,
      condicoesPagamento: this.condicoesPagamento,
      contasReceber: this.contasReceber
    }
  }

  get toVendaDraft(): VendaDraft {
    return {
      id: this.id,
      cliente: this.cliente,
      items: this.items.map(item => item.toVendaItemDraft),
    }
  }

  fromVendaDraft(venda: VendaDraft) {
    this.open();
    this._cliente = venda.cliente;
    venda.items.forEach((item: VendaItemDraft) => {
      this.items.push(this.createItem(item.produto, item.quantidade));
    })
  }

  get cliente() {
    return this._cliente;
  }

  set cliente(cliente: Cliente | undefined) {
    this._cliente = cliente;
    TableEvents.update.emit(this);

    if(this._cliente) {
      this.errorCliente = false;
    } else {
      if(this.obrigadoInformarCliente) {
        this.errorCliente = true;
      }
    }

    this.condicoesPagamento.forEach(condicaoPagamentoVenda => this.generateContasReceberIfNecessary(condicaoPagamentoVenda))
  }

  get obrigadoInformarCliente() {
    return this.condicoesPagamento
      .some(condicaoPagamentoVenda => condicaoPagamentoVenda.condicaoPagamento?.obrigadoInformarCliente);
  }

  get condicoesPagamento() {
    return this._condicoesPagamento;
  }

  addCondicaoPagamento() {
    let rowId = this.condicaoPagamentoRowId++;

    this._condicoesPagamento.push({
      rowId,
      valor: 0.01,
      condicaoPagamento: undefined,
      contasReceber: [],
      datasContasReceber: [],
      pristine: true
    })
  }

  removeCondicaoPagamento(condicaoToRemove: CondicaoPagamentoVenda) {
    const indexToRemove = this._condicoesPagamento.findIndex(condicaoVenda => condicaoVenda.rowId == condicaoToRemove.rowId);

    if(indexToRemove > -1) {
      this._condicoesPagamento.splice(indexToRemove, 1);
    }
  }

  get contasReceber() {
    return this._condicoesPagamento.flatMap(condicaoPagamentoVenda => condicaoPagamentoVenda.contasReceber)
  }

  get totalPago() {
    return this.condicoesPagamento.reduce((accumulator, condicaoPagamentoVenda) => {
      return accumulator + condicaoPagamentoVenda.valor;
    }, 0)
  }

  get valorRestante() {
    return this.total - this.totalPago;
  }

  get temCondicaoPagamentoZerada() {
    return this._condicoesPagamento.some(condicaoPagamentoVenda => condicaoPagamentoVenda.valor == 0);
  }
}

export class Item {
  readonly produto: Produto;
  readonly _valor;
  private _quantidade = 0;
  private _subtotal = 0;
  updateEmitter!: Function

  constructor(produto: Produto, quantidade: number) {
    this.produto = produto;
    this._valor = produto.valor;
    this._quantidade = quantidade;
    this.calculateSubtotal();
  }

  get subtotal() {
    return this._subtotal;
  }

  increment() {
    this._quantidade += 1;
    this.calculateSubtotal();
  }

  private calculateSubtotal() {
    this._subtotal = this._valor * this.quantidade;
  }

  get quantidade() {
    return this._quantidade;
  }

  set quantidade(quantidade: number) {
    this._quantidade = quantidade;
    this.updateEmitter();
    this.calculateSubtotal();
  }

  public get toVendaItem(): VendaItem {
    return {
      produto: this.produto,
      valor: this._valor,
      quantidade: this.quantidade,
      subtotal: this.subtotal
    }
  }

  public get toVendaItemDraft(): VendaItemDraft {
    return {
      produto: this.produto,
      quantidade: this.quantidade,
    }
  }
}
