import { RazaoFechamentoCaixa } from './razao-fechamento-caixa.model';
import { AberturaCaixa } from './abertura-caixa.model';

export interface FechamentoCaixa {
  id?: number;
  dataCadastro?: Date;
  razoes: RazaoFechamentoCaixa[];
  aberturaCaixa: AberturaCaixa;
}
