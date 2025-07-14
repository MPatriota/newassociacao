import { DataSource } from "typeorm";
import { DatabaseAccessor } from "../../configuration/database-accessor";
import { DependencyContainer } from "../../configuration/dependency-container";
import { Venda } from '../../entity/venda.entity';
import { AberturaCaixa } from '../../entity/abertura-caixa.entity';
import { AberturaCaixaRepository } from '../abertura-caixa.repository';
import { FechamentoCaixa } from '../../entity/fechamento-caixa.entity';

describe('AberturaCaixaRepository', () => {

  let aberturaCaixaRepository: AberturaCaixaRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    aberturaCaixaRepository = DependencyContainer.getInstance().resolve(AberturaCaixaRepository);
    dataSource = await DatabaseAccessor.getDataSource().initialize();
  })

  beforeEach(async () => {
    await dataSource.manager.clear(Venda);
  })

  it('should find last opened abertura caixa', async () => {
    await dataSource.manager.insert(AberturaCaixa, { id: 1, saldoCaixa: 10, dataCadastro: new Date(2025, 3, 18)});
    await dataSource.manager.insert(AberturaCaixa, { id: 2, saldoCaixa: 10, dataCadastro: new Date(2025, 3, 19)});

    await dataSource.manager.insert(FechamentoCaixa, { id: 1, aberturaCaixa: {id: 1}});

    let lastAberturaCaixa = await aberturaCaixaRepository.findLastOpened();

    expect(lastAberturaCaixa!.id).toEqual(2);

    await dataSource.manager.insert(FechamentoCaixa, { id: 2, aberturaCaixa: {id: 2}});

    lastAberturaCaixa = await aberturaCaixaRepository.findLastOpened();

    expect(lastAberturaCaixa).toBeNull();
  })

})
