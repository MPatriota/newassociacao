import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;
  protected defaultTimeout: number = 5000;
  public saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = this.page.getByRole("button", { name: 'Salvar' });
  }

  async navegar(menu: string, tela: string, tituloTela: string): Promise<void> {
    await this.page.locator('a').getByText(menu, { exact: true }).click();
    await this.page.getByRole('link').getByText(tela, { exact: true }).click();
    await expect(this.page.getByRole('heading', { name: tituloTela })).toBeVisible();
  }

  async expectSaveButtonToBeDisabled(): Promise<void> {
    await expect(this.saveButton).toBeDisabled();
  }

  async clicarBotaoNovo(): Promise<void> {
    await this.page.getByTestId('botao_novo').click();
  }

  /**
   * Aguarda até que um elemento esteja visível.
   * @param locator - O elemento a ser aguardado.
   * @param timeout - O tempo máximo de espera (ms).
   */
  async waitForVisibility(
    locator: Locator,
    timeout = this.defaultTimeout
  ): Promise<void> {
    await expect(locator).toBeVisible({ timeout: timeout });
  }

  /**
   * Clica em um botão identificado por seu nome.
   * @param name - O texto do botão.
   * @param clickCount - Número de cliques (padrão: 1).
   * @param timeout - O tempo máximo de espera (ms).
   */
  async clickButton(
    name: string,
    clickCount: number = 1,
    timeout = this.defaultTimeout
  ): Promise<void> {
    await this.page
      .getByRole('button', { name })
      .click({ timeout, clickCount });
  }

  async clickLocator(
    locator: Locator,
    timeout = this.defaultTimeout,
    force: boolean = false
  ): Promise<void> {
    await locator.click({ timeout, force });
  }

  /**
   * Clica no botão de salvar padrão.
   * @param force - Define se o clique será forçado.
   * @param timeout - O tempo máximo de espera (ms).
   */
  async clickSaveButton(
    force: boolean = false,
    timeout = this.defaultTimeout
  ): Promise<void> {
    await this.clickLocator(this.saveButton, timeout, force);
  }

  /**
   * Aguarda que uma mensagem de sucesso na operação apareça.
   * @param timeout - O tempo máximo de espera (ms).
   */
  async waitForSuccessMessage(mensagemToast: string, timeout = this.defaultTimeout): Promise<void> {
    const message = this.page.locator('p-toastitem', {
      hasText: mensagemToast,
    });
    await this.waitForVisibility(message, timeout);
  }

  /**
   * Aguarda que múltiplos elementos estejam visíveis.
   * @param locators - Lista de elementos.
   * @param timeout - O tempo máximo de espera (ms).
   */
  async waitForAllLocatorsVisible(
    locators: Locator[],
    timeout = this.defaultTimeout
  ): Promise<void> {
    for (const locator of locators) {
      await this.waitForVisibility(locator, timeout);
    }
  }

  /**
   * Aguarda que uma mensagem específica desapareça.
   * @param message - O texto da mensagem.
   * @param timeout - O tempo máximo de espera (ms).
   */
  async waitForMessageToDisappear(
    message: string,
    timeout = this.defaultTimeout
  ): Promise<void> {
    const messageLocator = this.page.getByText(message);
    await expect(messageLocator).toBeHidden({ timeout });
  }

  /**
   * Preenche um campo de entrada (input) com o valor especificado.
   * @param field - O campo de entrada a ser preenchido.
   * @param value - O valor que será inserido no campo.
   */
  async fillField(field: Locator, value: string): Promise<void> {
    await field.fill(value);
  }

  /**
   * Seleciona uma opção de um dropdown com base no valor especificado.
   * @param dropdown - O campo de dropdown a ser manipulado.
   * @param value - O valor da opção que será selecionada.
   */
  async selectDropdownOption(dropdown: Locator, value: string): Promise<void> {
    await dropdown.selectOption(value);
  }

  /**
   * Obtém o valor atual de um campo de entrada (input).
   * @param field - O campo de entrada cujo valor será obtido.
   * @returns O valor do campo.
   */
  async getFieldValue(field: Locator): Promise<string> {
    return await field.inputValue();
  }

  /**
   * Lida com um diálogo de confirmação, verificando a mensagem exibida e clicando no botão especificado.
   * @param message - A mensagem exibida no diálogo de confirmação.
   * @param buttonText - O texto do botão que será clicado (ex.: "Sim" ou "Não").
   * @param timeout - O tempo limite em milissegundos para aguardar o diálogo.
   */
  async responderDialogoConfirmacao(
    message: string,
    buttonText: string,
    timeout: number = this.defaultTimeout
  ): Promise<void> {
    const dialogoDeConfirmacao = this.page.locator('#dialogConfirm');
    await expect(dialogoDeConfirmacao.getByText(message)).toBeVisible({
      timeout,
    });
    await dialogoDeConfirmacao
      .getByRole('button', { name: buttonText })
      .click();
  }

  /**
   * Preenche um campo de autocomplete e seleciona uma opção correspondente ao texto fornecido.
   * @param locator - O localizador do campo de entrada.
   * @param textOption - O texto da opção que será selecionada.
   */
  async fillAndSelectOptionByText(
    locator: Locator,
    textOption: string
  ): Promise<void> {
    await this.fillField(locator, textOption);
    const locatorOption = this.page.locator('li.autocomplete-item.selected', {
      hasText: textOption,
    });
    await this.waitForVisibility(locatorOption);
    await locatorOption.click();
  }
}
