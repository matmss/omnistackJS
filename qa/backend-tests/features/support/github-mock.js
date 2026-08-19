const nock = require('nock');

const FIXTURES = {
  gaearon: {
    login: 'gaearon',
    name: 'Dan Abramov',
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    bio: 'Working on React',
  },
  'near-match': {
    login: 'near-match',
    name: 'Near Match',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    bio: 'Test fixture',
  },
};

/** Stubs GET https://api.github.com/users/:username for a known fixture username. */
function mockGithubUser(username, overrides = {}) {
  const fixture = FIXTURES[username] || {
    login: username,
    name: null, // DevController falls back to `login` per FR-1.2 when name is absent
    avatar_url: `https://avatars.githubusercontent.com/u/0?v=4`,
    bio: 'Auto-generated fixture bio',
  };

  nock('https://api.github.com')
    .get(`/users/${username}`)
    .reply(200, { ...fixture, ...overrides });
}

/** Stubs a 404, as real GitHub would return for an unknown username (see OI-1 / BUG-004). */
function mockGithubUserNotFound(username) {
  nock('https://api.github.com').get(`/users/${username}`).reply(404, { message: 'Not Found' });
}

module.exports = { mockGithubUser, mockGithubUserNotFound, FIXTURES };
