import 'reflect-metadata';
import { app, nativeTheme } from 'electron';
import { Browser } from './browser';
import { IpcRegistryInjector } from '../configuration/ipc-registry-injector';
import { DatabaseAccessor } from '../configuration/database-accessor';
import { Logger } from '../service/logger.service';
import { ApplicationMetrics } from './application-metrics';
import { Store } from './store';
import { BootWindow } from './boot-window';

import '../resource/tag.resource';
import '../resource/produto.resource';
import '../resource/cliente.resource';
import '../resource/fornecedor.resource';
import '../resource/condicao-pagamento.resource';
import '../resource/estrada-estoque.resource';
import '../resource/saida-estoque.resource';
import '../resource/venda.resource';
import '../resource/abertura-caixa.resource';
import '../resource/fechamento-caixa.resource';
import '../resource/usuario.resource';
import '../resource/venda-draft.resource';
import '../resource/conta-pagar.resource';
import '../resource/conta-receber.resource';
import '../resource/utensilio.resource';
import '../resource/quiosque.resource';
import '../resource/agendamento-quiosque.resource';
import '../resource/notification.resource';
import '../resource/stat.resource';
import '../resource/associacao.resource';
import '../resource/configuracao.resource';
import { AudCreator } from '../configuration/aud-creator';

const appMetrics = new ApplicationMetrics();

async function init() {
  // Validação da data removida

  Store.instance;

  await DatabaseAccessor.getDataSource().initialize();

  await new AudCreator().createAud();

  const logger = Logger.getLogger('Main');

  logger.debug(`Running in ${app.isPackaged ? 'production' : 'development'} mode`);

  IpcRegistryInjector.getInstance().registryIpcHandlers();

  BootWindow.getInstance().closeWindow();

  Browser.getInstance();
}

app.whenReady().then(async () => {
  BootWindow.getInstance().createWindow();
  await init();
});

nativeTheme.themeSource = 'light';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    appMetrics.logMetrics();
    app.quit();
  }
});

app.on('activate', () => {
  if (!Browser.getInstance().hasWindow()) {
    Browser.getInstance().createWindow();
  }
});
