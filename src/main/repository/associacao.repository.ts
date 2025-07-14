import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import {Associacao} from '../entity/associacao.entity';
import {FechamentoCaixa} from '../entity/fechamento-caixa.entity';

@Injectable()
export class AssociacaoRepository extends AbstractRepository<Associacao> {

  constructor() {
    super(Associacao);
  }

  async findOne() {
    return this.repository.createQueryBuilder()
      .orderBy("id", "DESC")
      .getOne();
  }

}
