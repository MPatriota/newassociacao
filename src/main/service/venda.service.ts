import { Injectable } from "../annotation/injectable";
import { ProdutoService } from "./produto.service";
import { VendaRepository } from '../repository/venda.repository';
import { Venda } from '../entity/venda.entity';
import { AberturaCaixaRepository } from '../repository/abertura-caixa.repository';
import { RazaoFechamentoCaixa } from '../dto/razao-fechamento-caixa.dto';

@Injectable()
export class VendaService {

  constructor(
    private vendaRepository: VendaRepository,
    private produtoService: ProdutoService,
    private aberturaCaixaRepository: AberturaCaixaRepository,
  ) {}

  public async save(venda: Venda) {
    await this.attEstoque(venda);
    await this.bindAberturaCaixa(venda);

    return this.vendaRepository.save(venda);
  }

  private async attEstoque(venda: Venda) {
    venda.items.forEach(item => {
      this.produtoService.attEstoque(item.produto, -item.quantidade);
    })
  }

  private async bindAberturaCaixa(venda: Venda) {
    const lastAberturaCaixa = await this.aberturaCaixaRepository.findLastOpened();
    venda.aberturaCaixa = lastAberturaCaixa!;
  }

  public async findRazoesFechamentoCaixa(aberturaCaixaId: number) {
    const vendas = await this.vendaRepository.findByAberturaCaixaId(aberturaCaixaId);

    const razoes: RazaoFechamentoCaixa[] = [];

    vendas.flatMap(venda => venda.condicoesPagamento).forEach((condicaoPagamentoVenda) => {
      const existingRazao = razoes.find(razao => razao.condicaoPagamento.id === condicaoPagamentoVenda.condicaoPagamento.id);

      if(!existingRazao) {
        razoes.push(new RazaoFechamentoCaixa(condicaoPagamentoVenda.condicaoPagamento, condicaoPagamentoVenda.valor))
      } else {
        existingRazao.sumValorRegistrado(condicaoPagamentoVenda.valor);
      }
    })

    return razoes;
  }


}
