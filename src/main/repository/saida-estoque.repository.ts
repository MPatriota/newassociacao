import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { EntradaEstoque } from "../entity/entrada-estoque.entity";
import {SaidaEstoque} from '../entity/saida-estoque.entity';

@Injectable()
export class SaidaEstoqueRepository extends AbstractRepository<SaidaEstoque> {

  constructor() {
    super(SaidaEstoque);
  }

}
