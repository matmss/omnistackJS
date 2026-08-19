const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const io = require('socket.io-client');
// Note: the "When I submit a registration with ..." step used by these scenarios is
// defined once in registration.steps.js and reused here — Cucumber.js errors on duplicate
// step definitions ("ambiguous step"), so it must not be redefined in this file.

Given(
  'a client {string} is connected via WebSocket at latitude {string}, longitude {string} watching techs {string}',
  async function (alias, latitude, longitude, techs) {
    // Start the underlying HTTP server on an ephemeral port so socket.io-client can connect.
    await new Promise((resolve) => this.server.listen(0, resolve));
    const { port } = this.server.address();

    const socket = io(`http://127.0.0.1:${port}`, {
      query: { latitude, longitude, techs },
      transports: ['websocket'],
      forceNew: true,
    });

    this.receivedEvents[alias] = [];
    socket.on('new-dev', (payload) => {
      this.receivedEvents[alias].push({ event: 'new-dev', payload });
    });

    await new Promise((resolve, reject) => {
      socket.on('connect', resolve);
      socket.on('connect_error', reject);
    });

    this.sockets.push(socket);
  }
);

Then('client {string} should receive a {string} event within {int} seconds', async function (alias, eventName, seconds) {
  const deadline = Date.now() + seconds * 1000;
  while (Date.now() < deadline) {
    if (this.receivedEvents[alias].some((e) => e.event === eventName)) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  expect.fail(`Expected client "${alias}" to receive a "${eventName}" event within ${seconds}s, but it did not.`);
});

Then('client {string} should not receive a {string} event within {int} seconds', async function (alias, eventName, seconds) {
  await new Promise((r) => setTimeout(r, seconds * 1000));
  const received = this.receivedEvents[alias].some((e) => e.event === eventName);
  expect(received, `Expected client "${alias}" NOT to receive a "${eventName}" event, but it did.`).to.be.false;
});

Then('the event payload for {string} should contain github_username {string}', function (alias, username) {
  const match = this.receivedEvents[alias].find((e) => e.payload.github_username === username);
  expect(match, `No "new-dev" event with github_username "${username}" found for "${alias}"`).to.not.be.undefined;
});
