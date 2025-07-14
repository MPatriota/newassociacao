import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { FechamentoCaixa } from '../entity/fechamento-caixa.entity';

@Injectable()
export class FechamentoCaixaRepository extends AbstractRepository<FechamentoCaixa> {

  constructor() {
    super(FechamentoCaixa);
  }

}
