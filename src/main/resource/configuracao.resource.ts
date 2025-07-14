import { IpcClass } from '../annotation/ipc-class';
import { ConfiguracaoRepository } from '../repository/configuracao.repository';
import { IpcMethod } from '../annotation/ipc-method';

@IpcClass("configuracao")
export class ConfiguracaoResource {

  constructor(
    private readonly configuracaoRepository: ConfiguracaoRepository
  ) {}

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.configuracaoRepository.findAll({
      search,
      limit,
      page
    });

  }
}
