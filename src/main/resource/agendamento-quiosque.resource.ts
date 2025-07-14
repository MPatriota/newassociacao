import { IpcClass } from '../annotation/ipc-class';
import { IpcMethod } from '../annotation/ipc-method';
import { Page } from '../dto/page.dto';
import { applyPatch, Operation } from 'fast-json-patch/commonjs/core';
import * as statementSearchModel from '../util/statement/statement-search.model';
import { QuiosqueRepository } from '../repository/quiosque.repository';
import { Quiosque } from '../entity/quiosque.entity';
import { AgendamentoQuiosqueRepository } from '../repository/agendamento-quiosque.repository';
import { AgendamentoQuiosque } from '../entity/agendamento-quiosque.entity';
import { StatementSearchModel } from '../util/statement/statement-search.model';

@IpcClass("agendamentoQuiosque")
export class AgendamentoQuiosqueResource {

  constructor(
    private readonly agendamentoQuiosqueRepository: AgendamentoQuiosqueRepository
  ) {}

  @IpcMethod('save')
  async save(agendamentoQuiosque: AgendamentoQuiosque) {
    return this.agendamentoQuiosqueRepository.save(agendamentoQuiosque);
  }

  @IpcMethod('findById')
  async findById(id: number) {
    return this.agendamentoQuiosqueRepository.findById(id);
  }

  @IpcMethod('findAll')
  async findAll(page: number, limit: number, search?: string | StatementSearchModel) {

    return await this.agendamentoQuiosqueRepository.findAll({
      search,
      limit,
      page
    });

  }

  @IpcMethod('delete')
  async delete(id: number) {
    return this.agendamentoQuiosqueRepository.delete(id);
  }

  @IpcMethod('update')
  async update(id: number, partials: Operation[]) {
    return this.agendamentoQuiosqueRepository.update(id, partials);
  }

  @IpcMethod('findByQuiosque')
  async findByQuiosque(quiosqueId: number, data: Date) {
    return this.agendamentoQuiosqueRepository.findByQuiosqueAndData(quiosqueId, data);
  }


  @IpcMethod('findLast7Days')
  async findLast7Days() {
    return this.agendamentoQuiosqueRepository.findLast7Days();
  }

}
