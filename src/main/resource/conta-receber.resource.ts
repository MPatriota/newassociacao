import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import {StatementSearchModel} from '../util/statement/statement-search.model';
import { ContaReceberRepository } from '../repository/conta-receber.repository';
import { ContaReceber } from '../entity/conta-receber.entity';

@IpcClass("contaReceber")
export class ContaReceberResource {

  constructor(
    private readonly contaReceberRepository: ContaReceberRepository,
  ) {}

  @IpcMethod('save')
  async save(contaReceber: ContaReceber) {
    return this.contaReceberRepository.save(contaReceber);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.contaReceberRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string | StatementSearchModel) {

    return await this.contaReceberRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.contaReceberRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.contaReceberRepository.update(id, partials);
  }

}
