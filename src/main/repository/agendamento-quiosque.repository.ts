import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { AgendamentoQuiosque } from '../entity/agendamento-quiosque.entity';
import moment from 'moment';
import { Between } from "typeorm"

@Injectable()
export class AgendamentoQuiosqueRepository extends AbstractRepository<AgendamentoQuiosque> {

  constructor() {
    super(AgendamentoQuiosque);
  }

  public findByQuiosqueAndData(quiosqueId: number, data: Date) {
    return this.repository.findBy({
      quiosque: {
        id: quiosqueId,
      },
      data
    })
  }

  public findLast7Days() {
  const startOfWeek = moment().startOf('week').toDate(); // domingo
  const endOfWeek = moment().endOf('week').toDate();     // sábado (final do sábado)

  return this.repository.find({
    where: {
      data: Between(startOfWeek, endOfWeek),
    }
  });
}


}

