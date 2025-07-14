import { Endereco } from './endereco.model';
import { Dependente } from "./dependente.model";
import { CondicaoPagamento } from './condicao-pagamento.model';

export interface RazaoFechamentoCaixa {
  condicaoPagamento: CondicaoPagamento,
  valorRegistrado: number,
  valorContado: number
}
