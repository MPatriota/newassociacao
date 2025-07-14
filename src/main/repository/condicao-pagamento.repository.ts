import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { CondicaoPagamento } from "../entity/condicao-pagamento.entity";

@Injectable()
export class CondicaoPagamentoRepository extends AbstractRepository<CondicaoPagamento> {

  constructor() {
    super(CondicaoPagamento);
  }

}