/**
 * Test-data seeding helper for mobile E2E scenarios.
 *
 * The mobile app itself has no seeding mechanism — it only talks to whatever backend
 * MOBILE_API_URL / MOBILE_SOCKET_URL point at (see BUG-001: these are currently hardcoded
 * in mobile/src/services/api.js and socket.js rather than env-configurable; fixing that is
 * a prerequisite for pointing E2E runs at a disposable CI backend instance). Once fixed,
 * this helper calls that backend's real POST /devs endpoint directly — no mocking — so
 * mobile E2E runs are true integration tests against the real API contract.
 */
const axios = require('axios');

const API_URL = process.env.MOBILE_TEST_API_URL || 'http://localhost:3333';

async function registerDeveloperViaApi({ techs, nearbyOf, githubUsername = `e2e-fixture-${Date.now()}` }) {
  const [longitude, latitude] = nearbyOf;
  return axios.post(`${API_URL}/devs`, {
    github_username: githubUsername,
    techs: techs.join(','),
    latitude,
    longitude,
  });
}

// Alias kept for readability at call sites that are describing a precondition ("Given
// developers ... exist") rather than an action ("When a developer registers").
const seedDeveloper = registerDeveloperViaApi;

module.exports = { registerDeveloperViaApi, seedDeveloper };
