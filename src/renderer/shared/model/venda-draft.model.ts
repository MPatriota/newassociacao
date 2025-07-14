import { Cliente } from './cliente.model';
import { Produto } from './produto.model';

export interface VendaDraft {
  id: number;
  cliente?: Cliente;
  items: VendaItemDraft[];
}

export interface VendaItemDraft {
  id?: number;
  produto: Produto;
  quantidade: number;
}
