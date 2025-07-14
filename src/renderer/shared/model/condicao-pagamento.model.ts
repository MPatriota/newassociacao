export interface CondicaoPagamento {
  id?: number;
  nome: string;
  parcelas: number;
  intervalo: number;
  vencimento: number;
  descricao: string;
  ativa: boolean;
  obrigadoInformarCliente?: boolean;
  aVista?: boolean;
}
