import { getRepository } from 'typeorm';
import { Venda } from '../entity/venda.entity';

export class RelatoriosService {
  async financeiroPorPeriodo(dataInicio, dataFim) {
    const repo = getRepository(Venda);

    const resultados = await repo
      .createQueryBuilder('venda')
      .leftJoinAndSelect('venda.condicaoPagamento', 'condicaoPagamento')
      .select('condicaoPagamento.nome', 'condicaoPagamento')
      .addSelect('SUM(venda.valorTotal)', 'total')
      .where('venda.data BETWEEN :inicio AND :fim', { inicio: dataInicio, fim: dataFim })
      .groupBy('condicaoPagamento.nome')
      .orderBy('condicaoPagamento.nome')
      .getRawMany();

    return resultados;
  }
}
