import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { CondicaoPagamentoRepository } from "../repository/condicao-pagamento.repository";
import { CondicaoPagamento } from "../entity/condicao-pagamento.entity";

@IpcClass("condicaoPagamento")
export class CondicaoPagamentoResource {

  constructor(private readonly condicaoPagamentoRepository: CondicaoPagamentoRepository) {
  }

  @IpcMethod('save')
  async save(condicaoPagamento: CondicaoPagamento) {
    return this.condicaoPagamentoRepository.save(condicaoPagamento);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.condicaoPagamentoRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.condicaoPagamentoRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.condicaoPagamentoRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.condicaoPagamentoRepository.update(id, partials);
  }

}
