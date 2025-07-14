import { IpcClass } from '../annotation/ipc-class';
import {AssociacaoRepository} from '../repository/associacao.repository';
import {IpcMethod} from '../annotation/ipc-method';

@IpcClass("associacao")
export class AssociacaoResource {

  constructor(
    private readonly associacaoRepository: AssociacaoRepository
  ) {}

  @IpcMethod('find')
  async find() {
    return this.associacaoRepository.findOne();
  }

}
