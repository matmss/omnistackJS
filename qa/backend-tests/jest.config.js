// Unit-level tests for pure functions (calculateDistance, parseStringAsArray).
// Kept separate from the Cucumber BDD suite per docs/04-qa-process.md ("unit" test level).
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/unit/**/*.test.js'],
  rootDir: __dirname
};
