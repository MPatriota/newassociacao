import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Produto } from '../entity/produto.entity';

@Injectable()
export class ProdutoRepository extends AbstractRepository<Produto> {

  constructor() {
    super(Produto);
  }

}
