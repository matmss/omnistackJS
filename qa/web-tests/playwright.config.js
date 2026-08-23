const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/step_definitions/*.js',
});

// Assumes this package lives at repo-root/qa/web-tests, i.e. two levels below
// repo-root (qa/ then web-tests/), alongside repo-root/web (Create React App).
// The dev server is started automatically for local/CI runs; set
// WEB_BASE_URL to point at an already-running instance instead (e.g. staging).
module.exports = defineConfig({
  testDir,
  reporter: [
    ['html', { outputFolder: '../reports/web-html' }],
    ['json', { outputFile: '../reports/web.json' }],
  ],
  use: {
    baseURL: process.env.WEB_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  webServer: process.env.WEB_BASE_URL
    ? undefined
    : {
        command: 'npm start',
        cwd: '../../web',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // In some sandboxed/offline environments Playwright's expected browser build
        // isn't pre-fetched; point at whatever Chromium build is locally available
        // instead of triggering a download. Safe to remove where `npx playwright
        // install` has already run normally.
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : undefined,
      },
    },
  ],
});
