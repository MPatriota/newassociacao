import { Endereco } from './endereco.model';
import { CondicaoPagamento } from "./condicao-pagamento.model";

export interface Fornecedor {
    id?: number;
    nome: string;
    endereco?: Endereco;
    documento: string;
    responsavel: string;
    email: string;
    telefone: string;
    documentoTipo: string;
    condicaoPagamento?: CondicaoPagamento
}
