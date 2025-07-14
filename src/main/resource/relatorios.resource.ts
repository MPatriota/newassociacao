import { RelatoriosService } from '../service/relatorios.service';

export class RelatoriosResource {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  async getFinanceiroPorPeriodo(req, res) {
    const { dataInicio, dataFim } = req.query;

    const resultado = await this.relatoriosService.financeiroPorPeriodo(dataInicio, dataFim);
    res.send(resultado);
  }
}
