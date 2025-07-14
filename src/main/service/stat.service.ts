import { Injectable } from '../annotation/injectable';
import { DatabaseAccessor } from '../configuration/database-accessor';

@Injectable()
export class StatService {

  async getStats(): Promise<{
    totalVenda: number,
    totalContasPagar: number,
    totalContasAReceber: number
  }> {

    const totalVendaMes = await DatabaseAccessor.getDataSource().query('select SUM(total) as total_venda from venda WHERE extract(month from created_at) = extract(month from now())');

    const totalContasPagar = await DatabaseAccessor.getDataSource().query('select SUM(valor) as total_pagar from conta_pagar where paga = false'); //TODO PAGO

    const totalContasReceber = await DatabaseAccessor.getDataSource().query('select SUM(valor) as total_receber from conta_receber where paga = false'); // TODO RECEBIDO

    return { totalContasAReceber: totalContasReceber[0]['total_receber'], totalContasPagar: totalContasPagar[0]['total_pagar'], totalVenda: totalVendaMes[0]['total_venda'] }
  }

}
