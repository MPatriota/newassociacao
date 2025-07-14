import { Page } from '@playwright/test';
import { MarcadoresPage } from './marcadores/MarcadorPage';
import { ProdutosPage } from './produtos/ProdutosPage';

export class AdminModule {
  public marcadores: MarcadoresPage;
  public produtos: ProdutosPage;

  constructor(page: Page) {
    this.marcadores = new MarcadoresPage(page);
    this.produtos = new ProdutosPage(page);
  }
}
