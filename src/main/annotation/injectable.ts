import 'reflect-metadata';
import { DependencyContainer, INJECTABLE_METADATA_KEY, Type } from '../configuration/dependency-container';

export interface InjectableOptions {
  singleton?: boolean;
}

export function Injectable(options: InjectableOptions = { singleton: true }) {
  return function <T>(target: Type<T>) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, options, target);
    const container = DependencyContainer.getInstance();
    container.register(target.name, target);
  };
}
