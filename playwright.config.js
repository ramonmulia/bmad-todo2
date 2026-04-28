import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure'
  },
  webServer: [
    {
      command: 'cd backend && npm start',
      port: 3001,
      timeout: 10000,
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'cd frontend && npm run dev',
      port: 3000,
      timeout: 10000,
      reuseExistingServer: !process.env.CI
    }
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ]
});
