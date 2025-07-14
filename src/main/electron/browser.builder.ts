import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import path from 'path';
import { Store } from './store';

export class BrowserBuilder {
  constructor(
    private readonly isDevelopment: boolean,
    private width: number,
    private height: number
  ) {}

  public static builder() {
    return new BrowserBuilder(!app.isPackaged, 800, 600);
  }

  public build() {
    let mainWindow: BrowserWindow | null = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.maximize()
    mainWindow.show()

    mainWindow.setMenu(null);

    mainWindow.maximize();

    const appType = Store.instance.get('APP_TYPE');

    const indexSource = app.isPackaged
      ? path.join(
          process.resourcesPath,
          `app.asar/dist/${appType}/browser/index.html`
        )
      : path.join(__dirname, `../../${appType}/browser/index.html`);

    const loadConfig = url.format({
      pathname: indexSource,
      protocol: 'file:',
      slashes: true,
    });

    if(this.isDevelopment){
      require('electron-reloader')(module, {
        ignore: ['logs']
      });
      mainWindow.loadURL("http://localhost:4200/");
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
      mainWindow.loadURL(loadConfig);
    }

    mainWindow.on('closed', () => mainWindow.destroy());

    return mainWindow;
  }
}
