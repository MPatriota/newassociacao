import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { FornecedorRepository } from "../repository/fornecedor.repository";
import { Fornecedor } from "../entity/fornecedor.entity";

@IpcClass("fornecedor")
export class FornecedorResource {

  constructor(private readonly fornecedorRepository: FornecedorRepository) {
  }

  @IpcMethod('save')
  async save(fornecedor: Fornecedor) {
    return this.fornecedorRepository.save(fornecedor);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.fornecedorRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.fornecedorRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.fornecedorRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.fornecedorRepository.update(id, partials);
  }

}
