import { BrowserWindow } from 'electron';
import path from 'path';

export class BootWindow {
  private static instance: BootWindow;
  private loadingWindow: BrowserWindow | null = null;

  private constructor() {
  }

  static getInstance(): BootWindow {
    if (!BootWindow.instance) {
      BootWindow.instance = new BootWindow();
    }
    return BootWindow.instance;
  }

  createWindow(): BrowserWindow {
    this.loadingWindow = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.loadingWindow.loadFile(path.join(__dirname, '../template/loading.html'));

    return this.loadingWindow;
  }

  closeWindow() {
    if (this.loadingWindow) {
      this.loadingWindow.close();
      this.loadingWindow = null;
    }
  }
}
