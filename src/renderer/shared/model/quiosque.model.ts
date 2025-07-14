import { Utensilio } from './utensilio.model';

export type Quiosque = {
  id: number;
  nome: string;
  capacidadeMaxima: number;
  valorAluguel: number;
  descricao?: string;
  status: boolean;
  utensilios: QuiosqueUtensilio[];
  imagens: QuiosqueImagem[];
  salao?: boolean;
}

export type QuiosqueUtensilio = {
  id: number;
  utensilio: Utensilio;
  quantidade: number;
}

export type QuiosqueImagem = {
  id: number;
  imagem: string;
}
