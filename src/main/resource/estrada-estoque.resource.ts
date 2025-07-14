import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import { EntradaEstoqueRepository } from "../repository/entrada-estoque.repository";
import { EntradaEstoque } from "../entity/entrada-estoque.entity";
import { EntradaEstoqueService } from "../service/entrada-estoque.service";
import {StatementSearchModel} from '../util/statement/statement-search.model';

@IpcClass("entradaEstoque")
export class EntradaEstoqueResource {

  constructor(
      private readonly entradaEstoqueRepository: EntradaEstoqueRepository,
      private entradaEstoqueService: EntradaEstoqueService
  ) {}

  @IpcMethod('save')
  async save(entradaEstoque: EntradaEstoque) {
    return this.entradaEstoqueService.save(entradaEstoque);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.entradaEstoqueRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string | StatementSearchModel) {

    return await this.entradaEstoqueRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.entradaEstoqueService.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.entradaEstoqueService.update(id, partials);
  }

}
