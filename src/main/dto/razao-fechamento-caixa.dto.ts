import { CondicaoPagamento } from '../entity/condicao-pagamento.entity';

export class RazaoFechamentoCaixa {
  constructor(
    readonly condicaoPagamento: CondicaoPagamento,
    private valorRegistrado: number,
    private valorContado = 0
  ) {}

  sumValorRegistrado(valorRegistrado: number) {
    this.valorRegistrado += valorRegistrado;
  }
}
