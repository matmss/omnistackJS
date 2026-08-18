#!/usr/bin/env bash
# Unified DevRadar QA test runner.
# Run from the repo root (this file expects to sit alongside backend/, web/, mobile/).
#
# Exit code is non-zero if ANY suite fails, so this is a single CI gate
# (see docs/04-qa-process.md §1 and docs/06-framework-selection.md §5).

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

RUN_MOBILE="${RUN_MOBILE:-false}"   # mobile needs a simulator/emulator; opt-in, see README
TAGS="${TAGS:-}"                    # e.g. TAGS="@smoke" ./run-all-tests.sh

mkdir -p reports
overall_status=0

echo "== [1/3] Backend BDD suite (Cucumber.js) =========================="
( cd backend-tests && npx cucumber-js ${TAGS:+--tags "$TAGS"} --format json:../reports/backend.json --format progress )
backend_status=$?
[ $backend_status -ne 0 ] && overall_status=1

echo "== [2/3] Web BDD suite (Playwright + playwright-bdd) =============="
( cd web-tests && npx bddgen && npx playwright test ${TAGS:+--grep "$TAGS"} --reporter=json )
web_status=$?
mv web-tests/test-results/*.json reports/web.json 2>/dev/null || true
[ $web_status -ne 0 ] && overall_status=1

echo "== [3/3] Mobile suite =============================================="
if [ "$RUN_MOBILE" = "true" ]; then
  ( cd mobile-tests && npm run maestro )
  mobile_status=$?
  [ $mobile_status -ne 0 ] && overall_status=1
else
  echo "Skipped (set RUN_MOBILE=true to include; requires a simulator/emulator or the Maestro CLI)."
  mobile_status=-1
fi

echo "== Merging report =================================================="
BACKEND_STATUS=$backend_status WEB_STATUS=$web_status MOBILE_STATUS=$mobile_status node merge-report.js

echo ""
echo "===================================================================="
[ $backend_status -eq 0 ] && echo "Backend: PASS" || echo "Backend: FAIL"
[ $web_status -eq 0 ] && echo "Web:     PASS" || echo "Web:     FAIL"
if [ "$RUN_MOBILE" = "true" ]; then
  [ $mobile_status -eq 0 ] && echo "Mobile:  PASS" || echo "Mobile:  FAIL"
else
  echo "Mobile:  SKIPPED"
fi
echo "Merged report: reports/index.html"
echo "===================================================================="

exit $overall_status
