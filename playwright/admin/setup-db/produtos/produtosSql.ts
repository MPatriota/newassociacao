import { Client } from 'pg';

// Função para inserir um produto no banco
export async function inserirProduto(
  database: Client,
  tipoProduto: string,
  nome: string,
  precoVenda: number,
  custo: number,
  estoqueInicial: number,
  estoqueMinimo: number
) {
  await database.query(
    `INSERT INTO public.produto (
      imagem, nome, valor, custo, tipo, estoque, "estoqueMinimo", anotacoes, "codigoBarras", "dataCadastro", unidade_medida_id
    ) VALUES (
      NULL, $1, $2, $3, $4, $5, $6, '', NULL, NOW(), NULL
    );`,
    [nome, precoVenda, custo, tipoProduto, estoqueInicial, estoqueMinimo]
  );
}

// Função para excluir um produto pelo nome
export async function excluirProduto(database: Client, nome: string) {
  await database.query(
    `DELETE FROM public.produto WHERE nome = $1;`,
    [nome]
  );
}

// Função para buscar um produto pelo nome
export async function buscarProduto(database: Client, nome: string) {
  const result = await database.query(
    `SELECT * FROM public.produto WHERE nome = $1;`,
    [nome]
  );
  return result.rows;
}

// Função para limpar produtos que começam com "Produto"
export async function limparProdutosTeste(database: Client) {
  await database.query(`DELETE FROM public.produto WHERE nome LIKE 'Produto%';`);
}
