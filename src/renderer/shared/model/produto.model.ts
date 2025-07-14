import { Tag } from './tag.model';

export interface ProdutoTag {
  id?: number;
  tag: Tag;
  produto: Produto;
}

export interface Produto {
  id?: number;
  imagem: string;
  nome: string;
  valor: number;
  custo: number;
  tipo: TipoProduto;
  estoque: number;
  estoqueMinimo: number;
  anotacoes?: string;
  tags: ProdutoTag[];
  dataCadastro: Date;
}

export enum TipoProduto {
  CANTINA = 'Cantina',
  MATERIAL = 'Material',
}

export interface UnidadeMedida {
  id?: number;
  nome: string;
  sigla: string;
}

