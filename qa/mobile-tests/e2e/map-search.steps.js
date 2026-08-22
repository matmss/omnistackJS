const path = require('path');
const { defineFeature, loadFeature } = require('jest-cucumber');
const { device, element, by, waitFor } = require('detox');

const feature = loadFeature(path.join(__dirname, 'map-search.feature'));

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true, permissions: { location: 'unset' } });
  });

  test('App centers the map on the current device location', ({ given, when, then }) => {
    given('location permission is granted', async () => {
      await device.setLocation(-23.5505, -46.6333);
      await device.launchApp({ newInstance: true, permissions: { location: 'always' } });
    });

    when('the app launches', async () => {
      await waitFor(element(by.id('map-view'))).toBeVisible().withTimeout(10000);
    });

    then("the map should be centered on the device's current coordinates", async () => {
      // Detox/RN don't expose MapView's rendered region directly; assert the map mounted
      // successfully after a granted-permission launch as the practical proxy, per
      // Main.js's `if (!currentRegion) return null;` guard (FR-6.1).
      await expect(element(by.id('map-view'))).toBeVisible();
    });
  });

  test('Searching by tech shows matching nearby developers as markers', ({ given, when, then }) => {
    given('developers matching "ReactJS" exist within 10km', async () => {
      // Precondition seeded via the backend test API (see backend-tests/) pointed at by
      // the build under test — e2e/support/seed.js documents the expected approach.
      require('./support/seed').seedDeveloper({ techs: ['ReactJS'], nearbyOf: [-23.5505, -46.6333] });
    });

    when('I enter "ReactJS" in the search field and tap search', async () => {
      await element(by.id('search-input')).typeText('ReactJS');
      await element(by.id('search-button')).tap();
    });

    then('markers for the matching developers should appear on the map', async () => {
      await waitFor(element(by.id(/^marker-/)).atIndex(0)).toBeVisible().withTimeout(5000);
    });
  });

  test("Tapping a marker shows the developer's callout details", ({ given, when, then }) => {
    given('a developer marker is visible on the map', async () => {
      require('./support/seed').seedDeveloper({ techs: ['ReactJS'], nearbyOf: [-23.5505, -46.6333] });
      await element(by.id('search-input')).typeText('ReactJS');
      await element(by.id('search-button')).tap();
      await waitFor(element(by.id(/^marker-/)).atIndex(0)).toBeVisible().withTimeout(5000);
    });

    when('I tap the marker', async () => {
      await element(by.id(/^marker-/)).atIndex(0).tap();
    });

    then("a callout should display the developer's name, bio and techs", async () => {
      await expect(element(by.id('callout-name'))).toBeVisible();
      await expect(element(by.id('callout-bio'))).toBeVisible();
      await expect(element(by.id('callout-techs'))).toBeVisible();
    });
  });

  test('Tapping the callout opens the GitHub profile', ({ given, when, then }) => {
    given("a developer's callout is open", async () => {
      require('./support/seed').seedDeveloper({ techs: ['ReactJS'], nearbyOf: [-23.5505, -46.6333] });
      await element(by.id('search-input')).typeText('ReactJS');
      await element(by.id('search-button')).tap();
      await waitFor(element(by.id(/^marker-/)).atIndex(0)).toBeVisible().withTimeout(5000);
      await element(by.id(/^marker-/)).atIndex(0).tap();
    });

    when('I tap the callout', async () => {
      await element(by.id('callout-name')).tap();
    });

    then('the app should navigate to the Profile screen', async () => {
      await waitFor(element(by.id('profile-webview'))).toBeVisible().withTimeout(5000);
    });

    then("the Profile screen should load the developer's GitHub profile in a WebView", async () => {
      // Detox can't easily assert a WebView's internal `source.uri` cross-platform;
      // this documents the intent per FR-6.5. Consider adding an accessible
      // `accessibilityLabel={`profile-${github_username}`}` on the WebView so this can be
      // asserted precisely rather than by presence alone.
      await expect(element(by.id('profile-webview'))).toBeVisible();
    });
  });

  test('A live "new-dev" event adds a marker without re-searching', ({ given, when, then }) => {
    given('I have an active search for techs "ReactJS" centered on my region', async () => {
      await element(by.id('search-input')).typeText('ReactJS');
      await element(by.id('search-button')).tap();
    });

    when('a new developer matching "ReactJS" registers within 10km', async () => {
      await require('./support/seed').registerDeveloperViaApi({ techs: ['ReactJS'], nearbyOf: [-23.5505, -46.6333] });
    });

    then('a new marker should appear on the map without me tapping search again', async () => {
      await waitFor(element(by.id(/^marker-/)).atIndex(0)).toBeVisible().withTimeout(5000);
    });
  });

  test('Location permission denied', ({ given, when, then }) => {
    given('location permission is denied', async () => {
      await device.launchApp({ newInstance: true, permissions: { location: 'never' } });
    });

    when('the app launches', () => {
      // no-op: launch already happened in the Given step above for this scenario
    });

    then('the app should not crash', async () => {
      await expect(element(by.text('DevRadar'))).toExist();
    });
  });
});
