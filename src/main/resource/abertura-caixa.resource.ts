import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { AberturaCaixaRepository } from '../repository/abertura-caixa.repository';
import { AberturaCaixa } from '../entity/abertura-caixa.entity';

@IpcClass("aberturaCaixa")
export class AberturaCaixaResource {

  constructor(
    private readonly aberturaCaixaRepository: AberturaCaixaRepository
  ) { }

  @IpcMethod('save')
  async save(aberturaCaixa: AberturaCaixa) {
    return this.aberturaCaixaRepository.save(aberturaCaixa);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.aberturaCaixaRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.aberturaCaixaRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.aberturaCaixaRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.aberturaCaixaRepository.update(id, partials);
  }

  @IpcMethod('findLastOpened')
  async findLastOpened() {
    return this.aberturaCaixaRepository.findLastOpened();
  }

}
