# DevRadar QA — Full SDET scaffold

Everything in this folder is meant to be dropped into the root of `matmss/omnistackJS`,
alongside the existing `backend/`, `web/`, and `mobile/` folders.

```
omnistackJS/
├── backend/            (existing)
├── web/                (existing)
├── mobile/             (existing)
├── backend-tests/       ← this scaffold
├── web-tests/            ← this scaffold
├── mobile-tests/          ← this scaffold
├── docs/                   ← this scaffold (QA documentation set)
├── reports/                 ← generated at test-run time, gitignore this
├── package.json               ← this scaffold (root orchestrator)
├── run-all-tests.sh
├── merge-report.js
└── .github/workflows/unified-tests.yml
```

## Start here

1. Read `docs/01-requirements.md` through `docs/06-framework-selection.md` — the QA
   documentation set (requirements, BDD scenarios, detailed test cases, process, bug
   tracker template, and the framework rationale behind everything below).
2. `npm install` at the repo root (after merging this scaffold in) to set up the npm
   workspaces (`backend-tests`, `web-tests`, `mobile-tests`).
3. `npm run test:backend` / `npm run test:web` to run each suite individually during
   development, or `npm run test:all` (== `./run-all-tests.sh`) to run everything and
   produce `reports/index.html`.

## What was actually verified before delivery (not just written)

This scaffold was built by cloning the real `matmss/omnistackJS` repo and running the
suites against the real source — not written blind. Specifically:

- **Backend:** all `.feature` files pass a Cucumber `--dry-run` step-matching check
  against the real `backend/src` code (this caught and fixed a genuine "ambiguous step
  definition" bug during development). The two unit tests (`calculateDistance`,
  `parseStringAsArray`) run and pass against the real utility functions. Full scenario
  execution needs a MongoDB binary that this build sandbox couldn't download (network
  policy) — expect it to work normally in your own environment; if `mongodb-memory-server`
  can't download in your CI either, point `MONGO_URI` at a real disposable MongoDB service
  container instead (see comment in `backend-tests/features/support/hooks.js`).
- **Web:** all 4 scenarios in `web-tests/features/registration.feature` were generated
  via `bddgen` and **run to completion (4/4 passing)** against the real React app with
  Playwright, using route-mocked API responses and mocked browser geolocation. Fixed two
  real bugs found during this run: a step-signature mismatch with `playwright-bdd`'s
  fixture API, and a `playwright-bdd` version that was incompatible with a newer
  `@playwright/test` release.
- **Mobile:** could not be executed in this sandbox (no Android/iOS simulator available
  here). The `.feature`/step files are syntax-checked (`node --check`) and structurally
  correct against `mobile/src/pages/Main.js` and `Profile.js`'s actual behavior, but they
  assume `testID`s that don't exist in the app yet — see `mobile-tests/README.md` for the
  two prerequisites (Expo SDK upgrade for Detox, or use the Maestro flows today without
  app changes). The three Maestro YAML flows are syntax-validated.
- **Unified runner:** `merge-report.js` was run against real Cucumber-JSON and real
  Playwright-JSON output from the above runs and correctly summarized both (11/11 backend
  scenarios, 4/4 web scenarios) into `reports/index.html`.

## Known gaps this audit surfaced (see docs/05-bug-tracker.md for full list)

The most CI-relevant one: **mobile's API/socket URLs are hardcoded to a LAN IP**
(`192.168.15.11` in `mobile/src/services/api.js` and `socket.js`), not environment-
configurable like web's `REACT_APP_API_URL`. This blocks pointing mobile E2E tests at a
CI-hosted backend and should be fixed early (BUG-001, tracked as P1).
