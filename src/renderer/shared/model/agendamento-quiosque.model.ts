import { Cliente } from './cliente.model';
import { Quiosque } from './quiosque.model';
import { ContaReceber } from './conta-receber.model';

export interface AgendamentoQuiosque {
  id?: number;
  quiosque: Quiosque;
  cliente: Cliente;
  data: Date;
  horaInicio: string;
  horaFim: string;
  valor: number;
  descricao: string;
  contasReceber: ContaReceber[];
  matricula?: number;
}
