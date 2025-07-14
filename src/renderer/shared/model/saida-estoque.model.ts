import { Produto } from "./produto.model";
import { EntradaEstoqueTipoEnum } from "../enum/entrada-estoque-tipo.enum";
import { Fornecedor } from "./fornecedor.model";
import {ContaPagar} from './conta-pagar.model';

export interface SaidaEstoque {
    id?: number;
    produto: Produto;
    quantidade: number;
    requisitante: string;
    observacao: string;
}
