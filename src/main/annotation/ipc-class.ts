import { Injectable } from './injectable';

export const IPC_METADATA_KEY = 'ipc:class:id';

export function IpcClass(id: string): ClassDecorator {
  return function (target) {
    // @ts-ignore
    Injectable()(target);
    Reflect.defineMetadata(IPC_METADATA_KEY, id, target);
  };
}
