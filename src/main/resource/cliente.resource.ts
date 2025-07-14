import { Cliente } from '../entity/cliente.entity';
import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { ClienteRepository } from "../repository/cliente.repository";
import { applyPatch, Operation } from "fast-json-patch/commonjs/core";

@IpcClass("cliente")
export class ClienteResource {

  constructor(private readonly clienteRepository: ClienteRepository) {
  }

  @IpcMethod('save')
  async save(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.clienteRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string) {

    return await this.clienteRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.clienteRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.clienteRepository.update(id, partials);
  }

}
