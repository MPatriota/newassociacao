import { Produto } from "./produto.model";
import { EntradaEstoqueTipoEnum } from "../enum/entrada-estoque-tipo.enum";
import { Fornecedor } from "./fornecedor.model";
import {ContaPagar} from './conta-pagar.model';

export interface EntradaEstoque {
    id?: number;
    produto: Produto;
    quantidade: number;
    valor: number;
    subtotal: number;
    requisitante?: string;
    observacao: string;
    tipo: EntradaEstoqueTipoEnum;
    fornecedor?: Fornecedor;
    contasPagar: ContaPagar[];
}
