import { Cliente } from './cliente.model';

export interface ContaReceber {
  id?: number;
  valor: number;
  dataVencimento: Date;
  cliente?: Cliente;
  paga?: boolean;
  dataPagamento?: Date;
  descricao: string;
}
