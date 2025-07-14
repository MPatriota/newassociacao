import { Endereco } from './endereco.model';
import { Dependente } from "./dependente.model";

export interface Cliente {
    id?: number;
    nome: string;
    endereco?: Endereco;
    matricula: string;
    foto?: string;
    limiteCompra: number;
    dependentes: Dependente[];
    email: string;
}
