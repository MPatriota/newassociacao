import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {FrenteCaixaComponent} from '../frente-caixa.component';
import {FrenteCaixaModule} from '../frente-caixa.module';
import { Item, Table, TableEvents, TableStatus } from '../../../../shared/model/table.model';
import {ProdutoService} from '../../../../shared/services/produto.service';
import {of} from 'rxjs';
import {ClienteService} from '../../../../shared/services/cliente.service';
import { CondicaoPagamentoService } from '../../../../shared/services/condicao-pagamento.service';
import { VendaService } from '../../../../shared/services/venda.service';
import { AberturaCaixaService } from '../../../../shared/services/abertura-caixa.service';
import { VendaDraft } from '../../../../../main/entity/venda-draft.entity';
import { VendaDraftService } from '../../../../shared/services/venda-draft.service';
import {ElectronService} from 'ngx-electron';
import {TagService} from '../../../../shared/services/tag.service';

describe("FrenteCaixaComponent", () => {

  let fixture: ComponentFixture<FrenteCaixaComponent>;
  let component: FrenteCaixaComponent;
  let produtoService: any;
  let clienteService: any;
  let condicaoPagamentoService: any;
  let vendaService: any;
  let aberturaCaixaService: any;
  let vendaDraftService: any;
  let updateEvent: any;
  let deleteEvent: any;
  let tagService: any;

  beforeEach(async () => {
    produtoService = {
      findAll: jest.fn(() => of())
    }

    clienteService = {
      findAll: jest.fn(() => of())
    }

    condicaoPagamentoService = {
      findAll: jest.fn(() => of()),
      generateDates: jest.fn(() => [])
    }

    vendaService = {
      save: jest.fn(() => of({}))
    }

    aberturaCaixaService = {
      save: jest.fn(() => of({})),
      findLastOpened: jest.fn(() => of())
    }

    vendaDraftService = {
      findAll: jest.fn(() => of({content: []})),
      save: jest.fn(() => of({})),
      delete: jest.fn(() => of()),
    }

    tagService = {
      findTagsFromCantina: jest.fn(() => of([])),
    }

    await TestBed.configureTestingModule({
      imports: [FrenteCaixaModule],
      providers: [
        { provide: ProdutoService, useValue: produtoService },
        { provide: ClienteService, useValue: clienteService },
        { provide: CondicaoPagamentoService, useValue: condicaoPagamentoService },
        { provide: VendaService, useValue: vendaService },
        { provide: AberturaCaixaService, useValue:  aberturaCaixaService },
        { provide: VendaDraftService, useValue:  vendaDraftService },
        { provide: TagService, useValue:  tagService },
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FrenteCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    updateEvent = jest.spyOn(TableEvents.update, 'emit');
    updateEvent.mockClear()
    deleteEvent = jest.spyOn(TableEvents.delete, 'emit');
    deleteEvent.mockClear()
  })

  it('should find vendas drafts on init', () => {
    const vendasDrafts = [
      {
        id: 20
      }
    ]
    vendaDraftService.findAll = jest.fn(() => of({content: vendasDrafts}));

    component.ngOnInit();

    expect(vendaDraftService.findAll).toHaveBeenCalledTimes(1);
    expect(vendaDraftService.findAll).toHaveBeenCalledWith(1, 999);
    expect(component.vendasDrafts).toEqual(vendasDrafts);
  })

  it('should define initial tables to max venda draft id if it is greater than initial tables', () => {
    vendaDraftService.findAll = jest.fn(() => of({content: [{id: 20}]}));

    component.ngOnInit();

    expect(component.initialTables).toEqual(20);
  })

  it('should set draft data on table when crating tables', () => {
    const vendaDraft = {
      id: 3,
      cliente: {
        id: 2,
      },
      items: [
        {
          produto: {
            id: 3,
            valor: 10
          },
          quantidade: 10
        },
        {
          produto: {
            id: 4,
            valor: 15
          },
          quantidade: 5
        },
      ]
    }

    vendaDraftService.findAll = jest.fn(() => of({content: [vendaDraft]}));

    component.tables = [];
    component.ngOnInit();

    let table3 = component.tables.find(table => table.id == 3);

    expect(table3?.isOcupada).toBeTruthy();
    expect(table3?.cliente).toEqual(vendaDraft.cliente);
    expect(table3?.items[0]).toEqual(expect.objectContaining(
      {
        produto: {
          id: 3,
          valor: 10
        },
        _valor: 10,
        _quantidade: 10,
        _subtotal: 100
      }
    ));
    expect(table3?.items[1]).toEqual(expect.objectContaining(
      {
        produto: {
          id: 4,
          valor: 15
        },
        _valor: 15,
        _quantidade: 5,
        _subtotal: 75
      }
    ));
  })

  it('should create tables on init', () => {
    expect(component.tables.length).toEqual(12);
    expect(component.filteredTables).toEqual(component.tables);

    for(let i = 1; i <= component.initialTables; i++) {
      const table = component.tables[i-1];

      expect(table.id).toEqual(i);

      if(i == 12) {
        expect(table.isLast).toBeTruthy();
      } else {
        expect(table.isLast).toBeFalsy();
      }
    }
  })

  it('should find produtos on init', () => {
    const produtosToReturn = [{id: 1, nome: 'produto'}];
    produtoService.findAll.mockReset();
    produtoService.findAll = jest.fn(() => of({content: produtosToReturn}));

    component.ngOnInit();

    expect(produtoService.findAll).toHaveBeenCalledTimes(1);
    expect(produtoService.findAll).toHaveBeenCalledWith(1, 25, {"children": [], "statement": "tipo==CANTINA"});
    expect(component.produtos).toEqual(produtosToReturn);
  })

  it('should find clientes on init', () => {
    const clientesToReturn = [{id: 1, nome: 'cliente'}];
    clienteService.findAll.mockReset();
    clienteService.findAll = jest.fn(() => of({content: clientesToReturn}));

    component.ngOnInit();

    expect(clienteService.findAll).toHaveBeenCalledTimes(1);
    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, "");
    expect(component.clientes).toEqual(clientesToReturn);
  })

  it('should find produtos by search', () => {
    const produtosToReturn = [{id: 1, nome: 'produto'}];
    produtoService.findAll.mockReset();
    produtoService.findAll = jest.fn(() => of({content: produtosToReturn}));
    component.produtoSearch = "teste";

    component.findProdutos();

    expect(produtoService.findAll).toHaveBeenCalledTimes(1);
    expect(produtoService.findAll).toHaveBeenCalledWith(1, 25, {"children": [], "statement": "tipo==CANTINA,nome=ilike=*teste*"});
    expect(component.produtos).toEqual(produtosToReturn);
  })

  it('should find clientes by search', () => {
    const clientesToReturn = [{id: 1, nome: 'cliente'}];
    clienteService.findAll.mockReset();
    clienteService.findAll = jest.fn(() => of({content: clientesToReturn}));

    component.findClientes("teste");

    expect(clienteService.findAll).toHaveBeenCalledTimes(1);
    expect(clienteService.findAll).toHaveBeenCalledWith(1, 10, "nome=ilike=*teste*");
    expect(component.clientes).toEqual(clientesToReturn);
  })

  it('should find condições de pagamento', () => {
    const condicoesToReturn = [{id: 1, nome: 'condicao'}];
    condicaoPagamentoService.findAll.mockReset();
    condicaoPagamentoService.findAll = jest.fn(() => of({content: condicoesToReturn}));

    component.findCondicoesPagamento("teste");

    expect(condicaoPagamentoService.findAll).toHaveBeenCalledTimes(1);
    expect(condicaoPagamentoService.findAll).toHaveBeenCalledWith(1, 10, "ativa==true,nome=ilike=*teste*");
    expect(component.condicoesPagamento).toEqual(condicoesToReturn);
  })

  it('should open table', () => {
    let table = new Table(1);

    component.openTable(table);

    expect(table.isOcupada).toBeTruthy();
    expect(component.openedTable).toEqual(table);
  })

  it('should collapse table', () => {
    const produto = {
      nome: 'Produto',
      valor: 10.00
    }

    let table = new Table(1);
    table.addItem(produto as any);

    component.finalizandoVenda = true;

    component.openTable(table);
    component.collapseTable();

    expect(component.openedTable).toBeUndefined();
    expect(table.isOcupada).toBeTruthy();
    expect(component.finalizandoVenda).toBeFalsy();
  })

  it('should close table if it is empty when collapsing', () => {
    let table = new Table(1);

    component.openTable(table);
    component.collapseTable();

    expect(component.openedTable).toBeUndefined();
    expect(table.isDisponivel).toBeTruthy();
  })

  it('should add item', () => {
    const table = new Table(1);
    component.openedTable = table;

    const produto1 = {
      id: 1,
      nome: 'Produto',
      valor: 10.00
    }

    const produto2 = {
      id: 2,
      nome: 'Produto 2',
      valor: 5.00
    }

    component.addProduto(produto1 as any);
    component.addProduto(produto1 as any);
    component.addProduto(produto2 as any);

    expect(table.items.length).toEqual(2);
    const item1 = table.items[0];
    expect(item1.produto).toEqual(produto1);
    expect(item1.quantidade).toEqual(2);
    expect(item1.subtotal).toEqual(20.00);

    const item2 = table.items[1];
    expect(item2.produto).toEqual(produto2);
    expect(item2.quantidade).toEqual(1);
    expect(item2.subtotal).toEqual(5.00);
  })

  it('should remove item', () => {
    const produto1 = {
      id: 1,
      nome: 'Produto',
      valor: 10.00
    }

    const produto2 = {
      id: 2,
      nome: 'Produto 2',
      valor: 10.00
    }

    const produto3 = {
      id: 3,
      nome: 'Produto 3',
      valor: 10.00
    }

    const table = new Table(1);
    table.addItem(produto1 as any);
    table.addItem(produto2 as any);
    table.addItem(produto3 as any);

    component.openedTable = table;

    component.removeProduto(produto2 as any);

    expect(table.items).toHaveLength(2);
    expect(table.items[0].produto.id).toEqual(1);
    expect(table.items[1].produto.id).toEqual(3);
  })

  it('should iniciar finalização venda', () => {
    component.finalizandoVenda = false;

    component.iniciarFinalizacaoVenda();

    expect(component.finalizandoVenda).toBeTruthy();
  })

  it('should cancelar finalização venda', () => {
    component.finalizandoVenda = true;

    component.cancelarFinalizacaoVenda();

    expect(component.finalizandoVenda).toBeFalsy();
  })

  it('should finalizar venda', () => {
    const produto = {
      nome: 'Produto',
      valor: 10.00
    }

    const cliente = {
      id: 1
    } as any;

    const condicaoPagamento = {
      id: 2,
      parcelas: 1
    } as any;

    let table = new Table(1);
    table.addItem(produto as any);
    table.cliente = cliente;
    table.setCondicaoPagamento(condicaoPagamento, [new Date(2025, 3, 21)]);

    component.openedTable = table;
    component.finalizandoVenda = true;

    component.finalizarVenda();

    expect(vendaService.save).toHaveBeenCalledTimes(1);
    expect(vendaService.save).toHaveBeenCalledWith({
      cliente,
      condicaoPagamento,
      contasReceber: [],
      items: [
        {
          produto,
          quantidade: 1,
          subtotal: 10,
          valor: 10
        }
      ],
      total: 10
    });
    expect(component.finalizandoVenda).toBeFalsy();
    expect(component.openedTable).toBeUndefined();
    expect(table.items).toHaveLength(0);
  })

  it('should create contas receber when condição de pagamento changes', () => {
    const date1 = new Date(2025, 3, 6);
    const date2 = new Date(2025, 3, 6);

    condicaoPagamentoService.generateDates = jest.fn(() => [date1, date2]);

    const produto = {
      nome: 'Produto',
      valor: 12.00
    }

    const cliente = {
      id: 1
    }

    let table = new Table(1);
    table.addItem(produto as any);
    table.cliente = cliente as any;

    component.openedTable = table;

    const condicaoPagamento = {
      parcelas: 2,
      nome: "Conta do Cliente"
    }

    component.changeCondicaoPagamento(condicaoPagamento as any);

    expect(table.contasReceber).toEqual([
      {
        cliente: cliente,
        valor: 6,
        dataVencimento: date1,
        descricao: ""
      },
      {
        cliente: cliente,
        valor: 6,
        dataVencimento: date2,
        descricao: ""
      }
    ])
  })

  it('should filter table by status', () => {
    let table1 = new Table(1);
    table1.open();

    let table2 = new Table(2);

    component.tables = [
      table1,
      table2
    ];

    component.selectedTableStatus = TableStatus.TODAS;
    component.filterTablesByStatus();

    expect(component.filteredTables).toEqual(component.tables);
    expect(component.showAddTable).toBeTruthy();

    component.selectedTableStatus = TableStatus.OCUPADA;
    component.filterTablesByStatus();

    expect(component.filteredTables).toEqual([table1]);
    expect(component.showAddTable).toBeFalsy();

    component.selectedTableStatus = TableStatus.DISPONIVEL;
    component.filterTablesByStatus();

    expect(component.filteredTables).toEqual([table2]);
    expect(component.showAddTable).toBeFalsy();

  })

  it('should delete table', () => {
    let table1 = new Table(1);
    let table2 = new Table(2);
    let table3 = new Table(2);
    table3.isLast = true;

    component.tables = [
      table1,
      table2,
      table3
    ];

    component.deleteTable(new MouseEvent(""));

    expect(component.tables).toEqual([table1, table2]);
    expect(component.filteredTables).toEqual([table1, table2]);
    expect(table2.isLast).toBeTruthy();

    component.deleteTable(new MouseEvent(""));

    expect(component.tables).toEqual([table1]);
    expect(component.filteredTables).toEqual([table1]);
    expect(table1.isLast).toBeTruthy();

    component.deleteTable(new MouseEvent(""));

    expect(component.tables).toEqual([]);
    expect(component.filteredTables).toEqual([]);
  })

  it('should emit delete when close table', () => {
    let table = new Table(1);

    table.close();

    expect(TableEvents.delete.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.delete.emit).toHaveBeenCalledWith(table);
  })

  it('should emit update when att cliente', () => {
    let table = new Table(1);

    table.cliente = {id: 1} as any;

    expect(TableEvents.update.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.update.emit).toHaveBeenCalledWith(table);
  })

  it('should emit update when att item', () => {
    let table = new Table(1);

    table.addItem({id: 1} as any);

    const item = table.items[0];

    updateEvent.mockClear();

    item.quantidade = 2;

    expect(TableEvents.update.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.update.emit).toHaveBeenCalledWith(table);
  })

  it('should emit update when add item', () => {
    let table = new Table(1);

    table.addItem({id: 1} as any);

    expect(TableEvents.update.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.update.emit).toHaveBeenCalledWith(table);
  })

  it('should emit update when remove item and table does not become empty', () => {
    const produto1 = {
      id: 1,
      nome: 'Produto',
      valor: 10.00
    }

    const produto2 = {
      id: 2,
      nome: 'Produto 2',
      valor: 10.00
    }

    const table = new Table(1);
    table.addItem(produto1 as any);
    table.addItem(produto2 as any);

    component.openedTable = table;

    updateEvent.mockClear();

    component.removeProduto(produto2 as any);

    expect(table.isEmpty).toBeFalsy();
    expect(TableEvents.update.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.update.emit).toHaveBeenCalledWith(table);
  })

  it('should emit delete when remove item and table becomes empty', () => {
    const produto1 = {
      id: 1,
      nome: 'Produto',
      valor: 10.00
    }

    const table = new Table(1);
    table.addItem(produto1 as any);

    component.openedTable = table;

    component.removeProduto(produto1 as any);

    expect(table.isEmpty).toBeTruthy();
    expect(TableEvents.delete.emit).toHaveBeenCalledTimes(1);
    expect(TableEvents.delete.emit).toHaveBeenCalledWith(table);
  })

  it('should save venda draft when update emits', fakeAsync(() => {
    let table = new Table(1);
    table.cliente = {id: 2} as any;

    const produto = {
      id: 3,
      nome: 'Produto',
      valor: 10.00
    }

    table.addItem(produto as any);
    table.addItem(produto as any);

    vendaDraftService.save.mockClear();

    TableEvents.update.emit(table);

    tick(600);

    expect(vendaDraftService.save).toHaveBeenCalledTimes(1);
    expect(vendaDraftService.save).toHaveBeenCalledWith({
      id: 1,
      cliente: {
        id: 2
      },
      items: [
        {
          produto: {
            id: 3,
            nome: 'Produto',
            valor: 10.00
          },
          quantidade: 2
        }
      ]
    });
  }))

  it('should delete venda draft when delete emits', fakeAsync(() => {
    let table = new Table(1);

    vendaDraftService.delete.mockClear();

    TableEvents.delete.emit(table);

    tick(600);

    expect(vendaDraftService.delete).toHaveBeenCalledTimes(1);
    expect(vendaDraftService.delete).toHaveBeenCalledWith(1);
  }))

})
