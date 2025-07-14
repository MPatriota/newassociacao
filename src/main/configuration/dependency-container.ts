import 'reflect-metadata';
import { Logger } from "../service/logger.service";
import { IPC_METADATA_KEY } from '../annotation/ipc-class';

export const INJECTABLE_METADATA_KEY = 'custom:injectable';
export const DEPENDENCIES_METADATA_KEY = 'custom:dependencies';

export interface Type<T> {
  new(...args: any[]): T;
}

export class DependencyContainer {

  private static INSTANCE: DependencyContainer;
  private logger: Logger = Logger.getLoggerByClass(this);
  private dependencies = new Map<string, any>();
  private singletons = new Map<string, any>();
  private lazyDependencies = new Map<string, any>();

  private constructor() {
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.INSTANCE) {
      DependencyContainer.INSTANCE = new DependencyContainer();
    }
    return DependencyContainer.INSTANCE;
  }

  register<T>(token: string | Type<T>, dependency: Type<T>): void {
    const key = typeof token === 'string' ? token : token.name;
    this.dependencies.set(key, dependency);
  }

  resolve<T>(token: string | Type<T>): T {

    const key = typeof token === 'string' ? token : token.name;

    const existingInstance = this.singletons.get(key);

    if (existingInstance) {
      return existingInstance;
    }

    let Dependency = this.dependencies.get(key);

    if (!Dependency) {
      try {
        this.autoRegister(token);
        Dependency = this.dependencies.get(key);
      } catch (error) {
        // @ts-ignore
        throw new Error(`Failed to resolve dependency ${key}: ${error.message}`);
      }
    }

    const paramTypes = Reflect.getMetadata('design:paramtypes', Dependency) || [];
    const injectionTokens = Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, Dependency) || [];

    const dependencies = paramTypes.map((type: any, index: number) => {
      const injectionToken = injectionTokens[index] || type;
      return this.resolve(injectionToken);
    });

    const instance = this.resolveLazyDependency(key, Dependency, dependencies);

    let injectableOptions = Reflect.getMetadata(INJECTABLE_METADATA_KEY, Dependency);

    if ((injectableOptions && injectableOptions['singleton']) && !this.singletons.has(key)) {
      this.singletons.set(key, instance);
    }

    return instance;
  }

  private resolveLazyDependency(key: string, dependencyInstance: any, dependencies: any) {

    if (Reflect.hasMetadata(IPC_METADATA_KEY, dependencyInstance)) {
      return new dependencyInstance(...dependencies);
    }

    const proxyDependency = new Proxy({}, {
      get: (target: any, prop: string) => {
        if (this.lazyDependencies.has(key)) {
          this.lazyDependencies.delete(key);
          target.instance = new dependencyInstance(...dependencies);
          this.singletons.set(key, target.instance);
        }
        return target.instance[prop];
      }
    });

    this.lazyDependencies.set(key, proxyDependency);

    return proxyDependency;
  }

  private autoRegister<T>(token: string | Type<T>): void {

    const dependency = typeof token === 'string' ? undefined : token;

    if (!dependency) {
      throw new Error(`Cannot auto-register string token: ${token}`);
    }

    const isInjectable = Reflect.getMetadata(INJECTABLE_METADATA_KEY, dependency);

    if (!isInjectable) {
      throw new Error(`Class ${dependency.name} is not decorated with @Injectable()`);
    }

    this.logger.debug('Auto-registering dependency: %s', dependency.name)

    this.register(dependency, dependency);
  }

}
