const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');
const { INTEGRATION_BACKEND_PORT } = require('./features/support/global-setup');

// Runs the @integration scenarios against the REAL backend (real Express routes, real
// MongoDB via mongodb-memory-server, only GitHub's third-party API stubbed — see
// features/support/backend-server.js) instead of the `page.route` mocks used by
// playwright.config.js. Kept as a separate config/npm script (`test:integration`) rather
// than folded into the default `test` run: it boots a whole extra backend+DB per run, so it
// shouldn't slow down (or be required for) the fast mocked suite's day-to-day use.
const testDir = defineBddConfig({
  features: 'features/integration/*.feature',
  steps: 'features/step_definitions/*.js',
  // Distinct from the default .features-gen used by playwright.config.js, so generating
  // one suite's spec files never clobbers the other's.
  outputDir: '.features-gen-integration',
});

const backendUrl = `http://localhost:${INTEGRATION_BACKEND_PORT}`;

module.exports = defineConfig({
  testDir,
  globalSetup: require.resolve('./features/support/global-setup'),
  reporter: [
    ['html', { outputFolder: '../reports/web-integration-html' }],
    ['json', { outputFile: '../reports/web-integration.json' }],
  ],
  use: {
    baseURL: process.env.WEB_BASE_URL || 'http://localhost:3001',
    trace: 'retain-on-failure',
  },
  webServer: process.env.WEB_BASE_URL
    ? undefined
    : {
        command: 'npm start',
        cwd: '../../web',
        url: 'http://localhost:3001',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        env: {
          PORT: '3001',
          BROWSER: 'none',
          REACT_APP_API_URL: backendUrl,
        },
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : undefined,
      },
    },
  ],
});
