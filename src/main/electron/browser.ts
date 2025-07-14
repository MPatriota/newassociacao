import { BrowserWindow } from 'electron';
import { BrowserBuilder } from './browser.builder';

export class Browser {

  private static INSTANCE: Browser | null = null;

  private mainWindow: BrowserWindow | null;

  constructor(mainWindowInit: BrowserWindow | null) {
    this.mainWindow = mainWindowInit;
  }

  static getInstance() {
    if (this.INSTANCE === null) {
      this.INSTANCE = new Browser(BrowserBuilder.builder().build());
    }
    return this.INSTANCE;
  }

  hasWindow(): boolean {
    return !!this.mainWindow;
  }

  createWindow(): void {
    this.mainWindow = BrowserBuilder.builder().build();
  }

}
