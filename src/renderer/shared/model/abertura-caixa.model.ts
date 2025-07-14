import { Endereco } from './endereco.model';
import { Dependente } from "./dependente.model";

export interface AberturaCaixa {
  id?: number;
  dataCadastro: Date;
  saldoCaixa: number;
}
