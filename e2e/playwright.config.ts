import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({
  quiet: true,
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : process.env.CI ? 2 : 0,
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : undefined,
  reporter: [['html', { open: 'never', outputFolder: 'results/playwright-report' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: process.env.ACTION_TIMEOUT ? parseInt(process.env.ACTION_TIMEOUT) : 10000,
    navigationTimeout: process.env.NAVIGATION_TIMEOUT ? parseInt(process.env.NAVIGATION_TIMEOUT) : 30000,
  },

  globalSetup: require.resolve('./global-setup'),
  timeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : 60000,
  expect: {
    timeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  outputDir: 'results/test-results/',
});
