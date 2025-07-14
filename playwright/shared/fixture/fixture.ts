import { test as base, expect } from 'playwright/test';
import { Client } from 'pg';
import { Store } from '../../../src/main/electron/store';
import path from 'path';
import {
  _electron as electron,
  ElectronApplication,
  Page,
} from 'playwright-core';
import { AdminModule } from '../../admin/pages/AdminModule';

export const test = base.extend<{
  database: Client;
  window: Page;
  adminModule: AdminModule;
}>({
  database: async ({}, use) => {
    Store.instance.get('');

    const client = new Client({
      host: Store.instance.get('POSTGRES_HOST'),
      port: Number(Store.instance.get('POSTGRES_PORT')),
      user: Store.instance.get('POSTGRES_USER'),
      password: Store.instance.get('POSTGRES_PASSWORD'),
      database: Store.instance.get('POSTGRES_DB'),
    });

    await client.connect();
    await use(client);
    await client.end();
  },
  window: async ({}, use) => {
    const electronApp: ElectronApplication = await electron.launch({
      args: [path.join(__dirname, '../../../dist/electron/electron/main.js')],
    });

    await electronApp.waitForEvent('window', async () => {
      return electronApp.windows().length >= 2;
    });

    const window: Page = electronApp.windows()[1];

    await expect(window.getByText('Bem-vindo, Admin')).toBeVisible();

    await use(window);
  },
  adminModule: async ({ window }, use) => {
    const adminModule = new AdminModule(window);
    await use(adminModule);
  },
});
