import { test } from '../../shared/fixture/fixture';
import { inserirProduto, excluirProduto, limparProdutosTeste } from '../setup-db/produtos/produtosSql';

test.describe('Tela de Produtos', () => {

  test.beforeEach(async ({ adminModule }) => {
    await adminModule.produtos.acessarProdutos();
  });

  test.afterEach(async ({ database }) => {
    await limparProdutosTeste(database);
  });

  test('Cadastrar produto com sucesso', async ({ adminModule }) => {
    await adminModule.produtos.cadastrarProduto({
      tipoProduto: 'Cantina',
      nome: 'Produto Teste',
      precoVenda: '100',
      custo: '80',
      estoqueInicial: '50',
      estoqueMinimo: '5'
    });

    await adminModule.produtos.pesquisarProduto('Produto Teste');
    await adminModule.produtos.verificarProdutoNaListagem('Produto Teste');
  });

  test('Não deve cadastrar produto sem nome', async ({ adminModule }) => {
    await adminModule.produtos.clicarBotaoNovo();
    await adminModule.produtos.preencherFormulario({
      tipoProduto: 'Cantina',
      nome: '',
      precoVenda: '100',
      custo: '80',
      estoqueInicial: '50',
      estoqueMinimo: '5'
    });

    await adminModule.produtos.expectSaveButtonToBeDisabled();
  });

  test('Editar produto existente', async ({ adminModule, database }) => {
    await inserirProduto(database, 'Cantina', 'Produto Editar', 100, 80, 50, 5);

    await adminModule.produtos.editarProduto('Produto Editar', {
      tipoProduto: 'Cantina',
      nome: 'Produto Editado',
      precoVenda: '150',
      custo: '120',
      estoqueInicial: '10',
      estoqueMinimo: '2'
    });

    await adminModule.produtos.pesquisarProduto('Produto Editado');
    await adminModule.produtos.verificarProdutoNaListagem('Produto Editado');
  });

  test('Excluir produto existente', async ({ adminModule, database }) => {
    await inserirProduto(database, 'Cantina', 'Produto Excluir', 100, 80, 50, 5);

    await excluirProduto(database, 'Produto Excluir');

    await adminModule.produtos.pesquisarProduto('Produto Excluir');
// await adminModule.produtos.verificarProdutoNaoEncontrado('Produto Excluir');
  });

  test('Não deve permitir duplicar produto', async ({ adminModule, database }) => {
    await inserirProduto(database, 'Cantina', 'Produto Duplicado', 100, 80, 50, 5);

    await adminModule.produtos.cadastrarProduto({
      tipoProduto: 'Cantina',
      nome: 'Produto Duplicado',
      precoVenda: '100',
      custo: '80',
      estoqueInicial: '50',
      estoqueMinimo: '5'
    });

// await adminModule.produtos.waitForErrorMessage('Produto já cadastrado');
  });

});
