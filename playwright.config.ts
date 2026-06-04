import { defineConfig, devices } from '@playwright/test';

const mailApiPort = process.env.MAIL_API_PORT || '4301';
const angularPort = process.env.ANGULAR_PORT || '4200';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${angularPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `node ./server/index.js`,
      url: `http://127.0.0.1:${mailApiPort}/api/ping`,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        MAIL_API_PORT: mailApiPort,
      },
    },
    {
      command: `npx ng serve --port ${angularPort} --host 127.0.0.1`,
      url: `http://127.0.0.1:${angularPort}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
