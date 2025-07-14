import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { VendaDraftRepository } from '../repository/venda-draft.repository';
import { VendaDraft } from '../entity/venda-draft.entity';

@IpcClass("vendaDraft")
export class VendaDraftResource {

  constructor(
    private readonly vendaDraftRepository: VendaDraftRepository,
  ) { }

  @IpcMethod('save')
  async save(vendaDraft: VendaDraft) {
    return this.vendaDraftRepository.save(vendaDraft);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.vendaDraftRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.vendaDraftRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.vendaDraftRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.vendaDraftRepository.update(id, partials);
  }

}
