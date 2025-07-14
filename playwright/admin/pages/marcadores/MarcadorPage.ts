import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/page/BasePage';

export class MarcadoresPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async acessarMarcadores() {
    await this.navegar('Produtos', 'Marcadores');
    await expect(this.page.getByText('Gerenciar Marcadores')).toBeVisible();
  }
}
