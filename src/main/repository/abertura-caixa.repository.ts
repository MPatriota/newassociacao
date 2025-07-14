import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { AberturaCaixa } from '../entity/abertura-caixa.entity';
import { FechamentoCaixa } from '../entity/fechamento-caixa.entity';

@Injectable()
export class AberturaCaixaRepository extends AbstractRepository<AberturaCaixa> {

  constructor() {
    super(AberturaCaixa);
  }

  public findLastOpened() {
    return this.repository.createQueryBuilder('aberturaCaixa')
      .leftJoin(FechamentoCaixa, 'fechamentoCaixa','fechamentoCaixa.id_abertura_caixa = aberturaCaixa.id')
      .where('fechamentoCaixa.id is null')
      .orderBy("aberturaCaixa.data_cadastro", "DESC")
      .getOne();
  }

}
