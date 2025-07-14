import { IpcMethod } from '../annotation/ipc-method';
import { IpcClass } from '../annotation/ipc-class';
import { Operation } from "fast-json-patch/commonjs/core";
import {SaidaEstoqueRepository} from '../repository/saida-estoque.repository';
import {SaidaEstoqueService} from '../service/saida-estoque.service';
import {SaidaEstoque} from '../entity/saida-estoque.entity';
import {StatementSearchModel} from '../util/statement/statement-search.model';

@IpcClass("saidaEstoque")
export class SaidaEstoqueResource {

  constructor(
      private readonly saidaEstoqueRepository: SaidaEstoqueRepository,
      private saidaEstoqueService: SaidaEstoqueService
  ) {}

  @IpcMethod('save')
  async save(saidaEstoque: SaidaEstoque) {
    return this.saidaEstoqueService.save(saidaEstoque);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.saidaEstoqueRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string | StatementSearchModel) {

    return await this.saidaEstoqueRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.saidaEstoqueService.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.saidaEstoqueService.update(id, partials);
  }

}
