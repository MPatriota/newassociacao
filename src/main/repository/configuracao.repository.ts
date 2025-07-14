import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Configuracao } from '../entity/configuracao.entity';

@Injectable()
export class ConfiguracaoRepository extends AbstractRepository<Configuracao> {

  constructor() {
    super(Configuracao);
  }

}
