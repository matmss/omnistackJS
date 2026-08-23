const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { buildDev } = require('../support/fixtures');

const { Given, When, Then } = createBdd();

// In-memory list the mocked GET /devs and POST /devs handlers read/write per test,
// so "submitting the form" is reflected in the next list fetch just like the real API.
// Stashed on $testInfo (a playwright-bdd fixture) so it's isolated per test worker/run.
function attachDevStore($testInfo) {
  $testInfo.devStore = $testInfo.devStore || [];
  return $testInfo.devStore;
}

Given('the browser grants geolocation permission at latitude {string} and longitude {string}', async function ({ context }, lat, lon) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: Number(lat), longitude: Number(lon) });
});

Given('the browser denies geolocation permission', async function ({ context }) {
  // Playwright's default is "prompt" without grantPermissions — DevForm's
  // navigator.geolocation.getCurrentPosition error callback fires, leaving lat/lon blank.
  await context.clearPermissions();
});

Given('the backend has no registered developers', async function ({ page, $testInfo }) {
  const store = attachDevStore($testInfo);
  store.length = 0;
  await mockDevsEndpoints(page, store);
});

Given('the backend has {int} registered developers', async function ({ page, $testInfo }, count) {
  const store = attachDevStore($testInfo);
  store.length = 0;
  for (let i = 0; i < count; i++) store.push(buildDev());
  await mockDevsEndpoints(page, store);
});

Given('the backend will accept a new registration for {string}', async function ({ page, $testInfo }, _username) {
  // The generic POST /devs mock in mockDevsEndpoints() accepts any username, so this step
  // exists mainly for scenario readability and to guarantee ordering relative to other
  // Given steps; _username documents intent without constraining the mock further.
  const store = attachDevStore($testInfo);
  if (!page.__devsMocked) await mockDevsEndpoints(page, store);
});

async function mockDevsEndpoints(page, store) {
  if (page.__devsMocked) return;
  page.__devsMocked = true;

  await page.route('**/devs', async (route) => {
    const request = route.request();
    if (request.method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(store) });
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON();
      const dev = buildDev({
        github_username: body.github_username,
        techs: String(body.techs)
          .split(',')
          .map((t) => t.trim()),
      });
      store.push(dev);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(dev) });
    }
    return route.continue();
  });
}

When('I open the DevRadar web app', async function ({ page }) {
  await page.goto('/');
});

When('I fill in github username {string}, techs {string} and submit', async function ({ page }, username, techs) {
  await page.getByLabel('Usuário GitHub').fill(username);
  await page.getByLabel('Tecnologias').fill(techs);
  await page.getByRole('button', { name: 'Salvar' }).click();
});

When('I manually fill in latitude {string} and longitude {string}', async function ({ page }, lat, lon) {
  await page.getByLabel('Latitude').fill(lat);
  await page.getByLabel('Longitude').fill(lon);
});

Then('the latitude field should contain {string}', async function ({ page }, value) {
  await expect(page.getByLabel('Latitude')).toHaveValue(value);
});

Then('the longitude field should contain {string}', async function ({ page }, value) {
  await expect(page.getByLabel('Longitude')).toHaveValue(value);
});

Then('a new entry for {string} should appear in the developer list', async function ({ page }, username) {
  await expect(page.locator('.dev-item', { hasText: username })).toBeVisible();
});

Then('the github username field should be empty', async function ({ page }) {
  await expect(page.getByLabel('Usuário GitHub')).toHaveValue('');
});

Then('the techs field should be empty', async function ({ page }) {
  await expect(page.getByLabel('Tecnologias')).toHaveValue('');
});

Then('the developer list should show {int} entries', async function ({ page }, count) {
  await expect(page.locator('.dev-item')).toHaveCount(count);
});
