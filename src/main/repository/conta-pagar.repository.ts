import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { ContaPagar } from '../entity/conta-pagar.entity';

@Injectable()
export class ContaPagarRepository extends AbstractRepository<ContaPagar> {

  constructor() {
    super(ContaPagar);
  }

}
