import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export class Store {

  private static INSTANCE: Store | null = null;

  private _store = new Map<String, any>();

  private constructor() {

    const existStoreFile = fs.existsSync(path.join(__dirname, '../../../environment'));
    const existFileStore = fs.existsSync(path.join(__dirname, '../../../environment/app-key.dat')) && fs.existsSync(path.join(__dirname, '../../../environment/environment-variables.dat'));

    if (existStoreFile && existFileStore) {

      const environmentPath = path.join(__dirname, '../../../environment');

      const key = fs.readFileSync(environmentPath + '/app-key.dat');

      const encryptedData = fs.readFileSync(environmentPath + '/environment-variables.dat', 'utf8');
      const [ivHex, encryptedHex] = encryptedData.split(':');

      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

      const variables = decrypted.toString('utf8').split('\n');
      for (const variable of variables) {
        if (variable.includes('=')) {
          const [key, value] = variable.split('=');
          this._store.set(key.trim(), value.trim());
        }
      }


    }

  }

  static get instance(): Store {
    if (Store.INSTANCE == null) {
      Store.INSTANCE = new Store();
    }
    return Store.INSTANCE;
  }

  public set(key: string, value: any): void {
    this._store.set(key, value);
  }

  public get(key: string): any {
    return this._store.get(key);
  }

}
