export interface Usuario {
  id?: number;
  nome: string;
  usuario: string;
  senha?: string;
  primeiroAcessoRealizado?: boolean;
}
