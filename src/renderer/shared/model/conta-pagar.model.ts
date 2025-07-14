import {Fornecedor} from './fornecedor.model';
import { ContaPagarStatus } from '../enum/conta-pagar-status.enum';

export interface ContaPagar {
  id?: number;
  fornecedor: Fornecedor;
  valor: number;
  dataVencimento: Date;
  paga?: boolean;
  status?: ContaPagarStatus;
  dataPagamento?: Date;
}
