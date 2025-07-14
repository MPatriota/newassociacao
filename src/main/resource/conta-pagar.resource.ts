import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import {StatementSearchModel} from '../util/statement/statement-search.model';
import { ContaPagarRepository } from '../repository/conta-pagar.repository';
import { ContaPagar } from '../entity/conta-pagar.entity';

@IpcClass("contaPagar")
export class ContaPagarResource {

  constructor(
      private readonly contaPagarRepository: ContaPagarRepository,
  ) {}

  @IpcMethod('save')
  async save(contaPagar: ContaPagar) {
    return this.contaPagarRepository.save(contaPagar);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.contaPagarRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string | StatementSearchModel) {

    return await this.contaPagarRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.contaPagarRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.contaPagarRepository.update(id, partials);
  }

}
