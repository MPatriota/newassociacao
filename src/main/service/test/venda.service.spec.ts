import { Produto } from "../../entity/produto.entity";
import { TipoProduto } from "../../entity/enums/tipo-produto";
import { UnidadeMedida } from "../../entity/unidade.medida.entity";
import { VendaService } from '../venda.service';
import { Venda } from '../../entity/venda.entity';
import { VendaItem } from '../../entity/venda-item.entity';
import { AberturaCaixa } from '../../entity/abertura-caixa.entity';
import { Confirmation } from 'primeng/api';

describe('VendaService', () => {
  let vendaService: VendaService;
  let vendaRepository: any;
  let produtoService: any;
  let aberturaCaixaRepository: any;

  beforeEach(() => {
    vendaRepository = {
      save: jest.fn()
    }

    produtoService = {
      attEstoque: jest.fn()
    }

    aberturaCaixaRepository = {
      findLastOpened: jest.fn(() => Promise.resolve(new AberturaCaixa({id: 1} as any)))
    }

    vendaService = new VendaService(vendaRepository, produtoService, aberturaCaixaRepository);
  })

  it('should att venda produtos estoque', () => {
    let produto1 = new Produto({
      id: 1
    } as any);

    let produto2 = new Produto({
      id: 2
    } as any);

    let vendaItem1 = new VendaItem({
      produto: produto1,
      quantidade: 2
    } as any);

    let vendaItem2 = new VendaItem({
      produto: produto2,
      quantidade: 3
    } as any);

    let venda = new Venda({
      items: [
        vendaItem1,
        vendaItem2,
      ]
    } as any);

    vendaService.save(venda);

    expect(produtoService.attEstoque).toHaveBeenCalledTimes(2);
    expect(produtoService.attEstoque).toHaveBeenCalledWith(produto1, -2);
    expect(produtoService.attEstoque).toHaveBeenCalledWith(produto2, -3);
  })

  it('should set abertura caixa on save', async () => {
    let venda = new Venda({
      items: []
    } as any);

    await vendaService.save(venda);

    expect(aberturaCaixaRepository.findLastOpened).toHaveBeenCalledTimes(1);
    expect(venda.aberturaCaixa.id).toEqual(1);
  })

  it('should find razoes fechamento caixa', async () => {
    const condicaoPagamento1 = {
      id: 1
    }

    const condicaoPagamento2 = {
      id: 2
    }

    vendaRepository.findByAberturaCaixaId = jest.fn(() => Promise.resolve([
      {
        condicaoPagamento: condicaoPagamento1,
        total: 10
      },
      {
        condicaoPagamento: condicaoPagamento1,
        total: 20
      },
      {
        condicaoPagamento: condicaoPagamento2,
        total: 40
      }
    ]));

    const razoes = await vendaService.findRazoesFechamentoCaixa(1);

    expect(razoes).toEqual([
      {
        condicaoPagamento: condicaoPagamento1,
        valorRegistrado: 30,
        valorContado: 0
      },
      {
        condicaoPagamento: condicaoPagamento2,
        valorRegistrado: 40,
        valorContado: 0
      }
    ])

  })
});
