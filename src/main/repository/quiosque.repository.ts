import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Quiosque } from '../entity/quiosque.entity';

@Injectable()
export class QuiosqueRepository extends AbstractRepository<Quiosque> {

  constructor() {
    super(Quiosque);
  }

}

