import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { VendaDraft } from '../entity/venda-draft.entity';

@Injectable()
export class VendaDraftRepository extends AbstractRepository<VendaDraft> {

  constructor() {
    super(VendaDraft);
  }

}
