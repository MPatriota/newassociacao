export const IPC_METHOD_METADATA_KEY = 'ipc:methods';

export function IpcMethod(name?: string): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    const methodName = name || propertyKey.toString();
    if (!Reflect.hasMetadata(IPC_METHOD_METADATA_KEY, target.constructor)) {
      Reflect.defineMetadata(IPC_METHOD_METADATA_KEY, [], target.constructor);
    }
    const methods = Reflect.getMetadata(IPC_METHOD_METADATA_KEY, target.constructor) as { name: string, propertyKey: string }[];
    methods.push({ name: methodName, propertyKey: propertyKey.toString() });
    Reflect.defineMetadata(IPC_METHOD_METADATA_KEY, methods, target.constructor);
  };
}
