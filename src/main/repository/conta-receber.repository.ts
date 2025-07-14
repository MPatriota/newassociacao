import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { ContaReceber } from '../entity/conta-receber.entity';

@Injectable()
export class ContaReceberRepository extends AbstractRepository<ContaReceber> {

  constructor() {
    super(ContaReceber);
  }

}
