import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../shared/page/BasePage';

export interface ProdutoData {
  tipoProduto: 'Cantina' | 'Material';
  nome: string;
  precoVenda: string;
  custo: string;
  estoqueInicial: string;
  estoqueMinimo: string;
}

export class ProdutosPage extends BasePage {
  private readonly selectTipoProduto: Locator;
  private readonly inputNomeProduto: Locator;
  private readonly inputPrecoVenda: Locator;
  private readonly inputCusto: Locator;
  private readonly inputEstoqueInicial: Locator;
  private readonly inputEstoqueMinimo: Locator;
  private readonly searchInput: Locator;
  private readonly editarProdutoButton: Locator;
  private readonly excluirProdutoButton: Locator;

  constructor(page: Page) {
    super(page);
    this.selectTipoProduto = this.page.getByTestId('select_tipo_produto');
    this.inputNomeProduto = this.page.getByTestId('input_nome_produto');
    this.inputPrecoVenda = this.page.locator('#precoVenda').getByRole('spinbutton');
    this.inputCusto = this.page.locator('#custo').getByRole('spinbutton');
    this.inputEstoqueInicial = this.page.locator('#estoqueInicial').getByRole('spinbutton');
    this.inputEstoqueMinimo = this.page.locator('#estoqueMinimo').getByRole('spinbutton');
    this.searchInput = this.page.getByPlaceholder('Pesquisar...');
    this.editarProdutoButton = this.page.locator('button[aria-label="editar_produto"]');
    this.excluirProdutoButton = this.page.locator('button[aria-label="excluir_produto"]');
  }

  async acessarProdutos() {
    await this.navegar('Produtos', 'Ver Produtos', 'Gerenciar Produtos');
  }

  async cadastrarProduto(produto: ProdutoData) {
    await this.clicarBotaoNovo();
    await this.preencherFormulario(produto);
    await this.clicarSalvarProduto();
    await this.waitForSuccessMessage('Produto salvo com sucesso');
  }

  async preencherFormulario(produto: ProdutoData) {
    await this.selecionarTipoProduto(produto.tipoProduto);
    await this.fillField(this.inputNomeProduto, produto.nome);

    await this.preencherCampoNumerico(this.inputPrecoVenda, produto.precoVenda);
    await this.preencherCampoNumerico(this.inputCusto, produto.custo);
    await this.preencherCampoNumerico(this.inputEstoqueInicial, produto.estoqueInicial);
    await this.preencherCampoNumerico(this.inputEstoqueMinimo, produto.estoqueMinimo);
  }

  async clicarSalvarProduto() {
    await this.clickSaveButton();
  }

  async pesquisarProduto(nome: string) {
    await this.fillField(this.searchInput, nome);
  }

  async verificarProdutoNaListagem(nome: string) {
    const productLocator = this.page.getByRole('row', { name: new RegExp(nome, 'i') });
    await this.waitForVisibility(productLocator);
  }

  async editarProduto(nomeAtual: string, novoProduto: ProdutoData) {
    await this.pesquisarProduto(nomeAtual);
    await this.editarProdutoButton.click();

    await this.preencherFormulario(novoProduto);
    await this.clicarSalvarProduto();
    await this.waitForSuccessMessage('Produto atualizado com sucesso');
  }

  async excluirProduto(nome: string) {
    await this.pesquisarProduto(nome);
    await this.excluirProdutoButton.click();
    await this.responderDialogoConfirmacao(
      'Deseja realmente excluir este produto?',
      'Sim'
    );
    await this.waitForSuccessMessage('Produto excluído com sucesso');
  }

  async preencherCampoNumerico(campo: Locator, valor: string) {
    await campo.clear();
    await campo.pressSequentially(valor);
  }

  async selecionarTipoProduto(tipoProduto: 'Cantina' | 'Material') {
    await this.selectTipoProduto.click();
    await this.selectTipoProduto.getByRole('option', { name: tipoProduto }).click();
  }
}
