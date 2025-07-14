import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Utensilio } from '../entity/utensilio.entity';

@Injectable()
export class UtensilioRepository extends AbstractRepository<Utensilio> {

  constructor() {
    super(Utensilio);
  }

}
