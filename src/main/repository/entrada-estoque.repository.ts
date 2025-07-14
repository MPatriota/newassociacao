import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { EntradaEstoque } from "../entity/entrada-estoque.entity";

@Injectable()
export class EntradaEstoqueRepository extends AbstractRepository<EntradaEstoque> {

  constructor() {
    super(EntradaEstoque);
  }

}