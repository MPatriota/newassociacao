import { Cliente } from './cliente.model';
import { Produto } from './produto.model';
import { CondicaoPagamento } from './condicao-pagamento.model';
import { ContaReceber } from './conta-receber.model';

export interface Venda {
  id?: number;
  cliente?: Cliente;
  items: VendaItem[];
  total?: number;
  condicoesPagamento: CondicaoPagamentoVenda[];
  contasReceber: ContaReceber[];
  createdAt?: Date;
}

export interface VendaItem {
  id?: number;
  produto: Produto;
  valor: number;
  quantidade: number;
  subtotal: number;
}

export interface CondicaoPagamentoVenda {
  id?: number;
  condicaoPagamento?: CondicaoPagamento;
  valor: number;
  rowId: number;
  contasReceber: ContaReceber[];
  datasContasReceber: Date[];
  pristine: boolean;
}
