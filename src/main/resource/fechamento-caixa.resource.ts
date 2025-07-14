import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { FechamentoCaixaRepository } from '../repository/fechamento-caixa.repository';
import { FechamentoCaixa } from '../entity/fechamento-caixa.entity';

@IpcClass("fechamentoCaixa")
export class FechamentoCaixaResource {

  constructor(
    private readonly fechamentoCaixaRepository: FechamentoCaixaRepository
  ) { }

  @IpcMethod('save')
  async save(fechamentoCaixa: FechamentoCaixa) {
    return this.fechamentoCaixaRepository.save(fechamentoCaixa);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.fechamentoCaixaRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.fechamentoCaixaRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.fechamentoCaixaRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.fechamentoCaixaRepository.update(id, partials);
  }

}
