import { Store } from './src/main/electron/store';

beforeAll(() => {
  process.env['NODE_ENV'] = 'test';
  Store.instance.set("NODE_ENV", "test");
});
