import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Venda } from '../entity/venda.entity';

@Injectable()
export class VendaRepository extends AbstractRepository<Venda> {

  constructor() {
    super(Venda);
  }

  public findByAberturaCaixaId(idAberturaCaixa: number) {
    return this.repository.createQueryBuilder("venda")
      .innerJoinAndSelect("venda.condicaoPagamento", "condicaoPagamento")
      .where("id_abertura_caixa = :idAberturaCaixa", {idAberturaCaixa})
      .getMany();
  }

}
