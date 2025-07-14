import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import { DependencyContainer } from './dependency-container';
import { IPC_METADATA_KEY } from '../annotation/ipc-class';
import { IPC_METHOD_METADATA_KEY } from '../annotation/ipc-method';
import { ipcMain } from 'electron';
import { Logger } from '../service/logger.service';

export interface Bean {
  id: string;
  instance: any;
  runnableMethods: { name: string, executable: Function }[];
}

export class IpcRegistryInjector {

  private static INSTANCE: IpcRegistryInjector;
  private logger: Logger = Logger.getLoggerByClass(this);
  registries: { [name: string]: Bean[] } = {};

  private constructor() {
  }

  get handlers() {
    return this.registries['ipc'];
  }

  static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new IpcRegistryInjector();
    }
    return this.INSTANCE;
  }

  registryIpcHandlers() {
    this.registries['ipc'] = [];
    const absolutePath = path.resolve(path.join(__dirname, '../resource'));
    this.analyzeAbsolutePath(absolutePath);
    this.handlers.forEach((registry) => {

      this.logger.debug('Registering bean with id [%s] and methods [%s]', registry.id, registry.runnableMethods.map(r => r.name));

      registry.runnableMethods.forEach((method) => {

        ipcMain.handle(`${registry.id}:${method.name}`, async (event, ...args) => {
          return method.executable.apply(registry.instance, args);
        });

      });

    });

  }

  private analyzeAbsolutePath(absolutePath: string) {
    fs.readdirSync(absolutePath).forEach((file) => {
      if (file.endsWith('.js') || file.endsWith('.ts')) this.processDependency(absolutePath, file);
    });
  }

  private processDependency(absolutePath: string, file: string) {
    const modulePath = path.join(absolutePath, file);
    const module = require(modulePath);
    Object.values(module).forEach((exportedClass) => {
      if (this.isBeanClass(exportedClass)) this.injectDependency(exportedClass);
    });
  }

  private injectDependency(exportedClass: any) {
    const id = Reflect.getMetadata(IPC_METADATA_KEY, exportedClass);
    const instance = DependencyContainer.getInstance().resolve(exportedClass);
    const methods = Reflect.getMetadata(IPC_METHOD_METADATA_KEY, exportedClass) || [];
    const runnableMethods = this.getRunnableMethodsOnBean(methods, instance);
    this.registries['ipc'].push({
      id,
      instance,
      runnableMethods,
    });
  }

  private getRunnableMethodsOnBean(methods: any, instance: any) {
    return methods.map((method: { name: string, propertyKey: string }) => ({
      name: method.name,
      executable: instance[method.propertyKey].bind(instance),
    }));
  }

  private isBeanClass(exportedClass: any) {
    return typeof exportedClass === 'function' && Reflect.hasMetadata(IPC_METADATA_KEY, exportedClass);
  }

}

