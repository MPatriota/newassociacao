import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { VendaRepository } from '../repository/venda.repository';
import { Venda } from '../entity/venda.entity';
import { VendaService } from '../service/venda.service';

@IpcClass("venda")
export class VendaResource {

  constructor(
    private readonly vendaRepository: VendaRepository,
    private readonly vendaService: VendaService,
  ) { }

  @IpcMethod('save')
  async save(venda: Venda) {
    return this.vendaService.save(venda);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.vendaRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.vendaRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.vendaRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.vendaRepository.update(id, partials);
  }

  @IpcMethod('findRazoesFechamentoCaixa')
  async findRazoesFechamentoCaixa(idAberturaCaixa: number) {
    return this.vendaService.findRazoesFechamentoCaixa(idAberturaCaixa);
  }

}
