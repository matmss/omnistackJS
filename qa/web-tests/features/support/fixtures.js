// Shared fixture builders for mocking the backend API that web/src/services/api.js talks to.
// Kept dependency-free (no faker) so the scaffold has no extra install surface.

let counter = 0;

function buildDev(overrides = {}) {
  counter += 1;
  const username = overrides.github_username || `fixture-dev-${counter}`;
  return {
    _id: `fixture-id-${counter}`,
    github_username: username,
    name: overrides.name || username,
    avatar_url: overrides.avatar_url || 'https://avatars.githubusercontent.com/u/1?v=4',
    bio: overrides.bio || 'Fixture bio',
    techs: overrides.techs || ['ReactJS'],
    location: { type: 'Point', coordinates: [-46.6333, -23.5505] },
    ...overrides,
  };
}

module.exports = { buildDev };
