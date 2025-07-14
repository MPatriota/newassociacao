import { IpcClass } from '../annotation/ipc-class';
import { IpcMethod } from '../annotation/ipc-method';
import { Page } from '../dto/page.dto';
import { applyPatch, Operation } from 'fast-json-patch/commonjs/core';
import * as statementSearchModel from '../util/statement/statement-search.model';
import { QuiosqueRepository } from '../repository/quiosque.repository';
import { Quiosque } from '../entity/quiosque.entity';

@IpcClass("quiosques")
export class QuiosqueResource {

  constructor(private readonly quiosqueRepository: QuiosqueRepository) {
  }

  @IpcMethod('save')
  async save(quiosque: Quiosque) {
    return this.quiosqueRepository.save(quiosque);
  }


  @IpcMethod('findAll')
  async findAll(page: number,
                limit: number,
                searchStatement?: statementSearchModel.StatementSearchModel | string): Promise<Page<Quiosque>> {

    return await this.quiosqueRepository.findAll({
      search: searchStatement,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number): Promise<void> {
    return this.quiosqueRepository.delete(id);
  }

  @IpcMethod('findById')
  async findById(id: number): Promise<Quiosque | null> {
    return this.quiosqueRepository.findById(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]): Promise<Quiosque | null> {

    const entity = await this.quiosqueRepository.findById(id);

    const editedEntity = applyPatch(entity, partials).newDocument;

    if (editedEntity) return this.quiosqueRepository.save(editedEntity);

    return null;
  }

}
