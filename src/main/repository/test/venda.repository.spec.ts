import { DataSource } from "typeorm";
import { DatabaseAccessor } from "../../configuration/database-accessor";
import { FornecedorRepository } from "../fornecedor.repository";
import { Fornecedor } from "../../entity/fornecedor.entity";
import { Endereco } from "../../entity/endereco.entity";
import { DocumentoTipoEnum } from "../../enum/documento-tipo.enum";
import { DependencyContainer } from "../../configuration/dependency-container";
import { CondicaoPagamento } from "../../entity/condicao-pagamento.entity";
import { CondicaoPagamentoRepository } from "../condicao-pagamento.repository";
import { VendaRepository } from '../venda.repository';
import { Venda } from '../../entity/venda.entity';
import { Tag } from '../../entity/tag.entity';
import { Cliente } from '../../entity/cliente.entity';
import { AberturaCaixa } from '../../entity/abertura-caixa.entity';

describe('VendaRepository', () => {

  let vendaRepository: VendaRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    vendaRepository = DependencyContainer.getInstance().resolve(VendaRepository);
    dataSource = await DatabaseAccessor.getDataSource().initialize();
  })

  beforeEach(async () => {
    await dataSource.manager.clear(Venda);
  })

  it('should find venda by abertura caixa id', async () => {
    await dataSource.manager.insert(AberturaCaixa, { id: 1, saldoCaixa: 10 });
    await dataSource.manager.insert(AberturaCaixa, { id: 2, saldoCaixa: 10 });

    await dataSource.manager.insert(CondicaoPagamento, { id: 1, nome: 'Condição 1', parcelas: 0, intervalo: 0, vencimento: 0, descricao: '' });

    await dataSource.manager.insert(Venda, { id: 3, total: 10, aberturaCaixa: {id: 1}, condicaoPagamento: {id: 1}});
    await dataSource.manager.insert(Venda, { id: 4, total: 10, aberturaCaixa: {id: 1}, condicaoPagamento: {id: 1}});
    await dataSource.manager.insert(Venda, { id: 5, total: 10, aberturaCaixa: {id: 2}, condicaoPagamento: {id: 1}});
    await dataSource.manager.insert(Venda, { id: 6, total: 10, aberturaCaixa: {id: 2}, condicaoPagamento: {id: 1}});

    const vendas = await vendaRepository.findByAberturaCaixaId(2);

    expect(vendas.map(venda => venda.id)).toEqual([6, 5]);
  })

})
