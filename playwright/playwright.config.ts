import { defineConfig } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'setup',
      testDir: `./shared/config`,
      testMatch: 'global.setup.ts'
    },

    {
      name: 'admin',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      testDir: './admin/tests'
    },

    {
      name: 'client',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      testDir: './client/tests',
    },
  ],
});
