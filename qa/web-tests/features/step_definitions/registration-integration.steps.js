const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { INTEGRATION_BACKEND_PORT } = require('../support/global-setup');

const { Given, Then } = createBdd();

// When/When/Then steps shared with the mocked suite ("I open the DevRadar web app",
// "I fill in github username ...", "a new entry for ... should appear", the empty-field
// checks, and "the developer list should show N entries") live in
// features/step_definitions/registration.steps.js and are reused as-is — playwright-bdd
// merges all step files it discovers into one registry, and none of those steps touch
// page.route, so they work unmodified against a real backend.

const BACKEND_URL = `http://localhost:${INTEGRATION_BACKEND_PORT}`;

Given('the real backend has no registered developers', async function () {
  const res = await fetch(`${BACKEND_URL}/__test__/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to reset the integration backend's data: ${res.status}`);
});

Given('the real backend has {int} registered developers', async function ({}, count) {
  await fetch(`${BACKEND_URL}/__test__/reset`, { method: 'POST' });
  const res = await fetch(`${BACKEND_URL}/__test__/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error(`Failed to seed the integration backend's data: ${res.status}`);
});

Then('reloading the page should still show {string} in the developer list', async function ({ page }, username) {
  await page.reload();
  await expect(page.locator('.dev-item', { hasText: username })).toBeVisible();
});
