#!/usr/bin/env node
/**
 * Merges the three layers' machine-readable results into one human-readable summary.
 *
 * Cucumber-JSON (backend), Playwright-JSON (web), and Detox/Maestro output (mobile) are
 * different enough shapes that a byte-level merge would be misleading; instead this
 * produces one dashboard that shows pass/fail counts per layer plus links out to each
 * layer's own full report (backend HTML from cucumber-html-reporter equivalent, web's
 * Playwright HTML report, mobile's Detox artifacts / Maestro output).
 */
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, 'reports');

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function summarizeCucumberJson(json) {
  if (!json) return { total: 0, passed: 0, failed: 0, available: false };
  let total = 0;
  let passed = 0;
  let failed = 0;
  for (const feature of json) {
    for (const element of feature.elements || []) {
      if (element.type !== 'scenario') continue;
      total += 1;
      const steps = element.steps || [];
      const ok = steps.every((s) => !s.result || s.result.status === 'passed' || s.result.status === 'skipped');
      if (ok) passed += 1;
      else failed += 1;
    }
  }
  return { total, passed, failed, available: true };
}

function summarizePlaywrightJson(json) {
  if (!json) return { total: 0, passed: 0, failed: 0, available: false };
  let total = 0;
  let passed = 0;
  let failed = 0;
  const walk = (suite) => {
    for (const spec of suite.specs || []) {
      total += 1;
      const ok = spec.tests?.every((t) => t.results?.every((r) => r.status === 'passed'));
      if (ok) passed += 1;
      else failed += 1;
    }
    for (const s of suite.suites || []) walk(s);
  };
  (json.suites || []).forEach(walk);
  return { total, passed, failed, available: true };
}

const backend = summarizeCucumberJson(safeReadJson(path.join(REPORTS_DIR, 'backend.json')));
const web = summarizePlaywrightJson(safeReadJson(path.join(REPORTS_DIR, 'web.json')));

const mobileStatus = process.env.MOBILE_STATUS;
const mobile = {
  available: mobileStatus !== undefined && mobileStatus !== '-1',
  status: mobileStatus === '0' ? 'PASS' : mobileStatus === '-1' ? 'SKIPPED' : 'FAIL',
};

function row(name, summary, extra) {
  if (!summary.available && !extra) {
    return `<tr><td>${name}</td><td colspan="4" class="muted">no results found</td></tr>`;
  }
  if (extra) {
    return `<tr><td>${name}</td><td colspan="4">${extra}</td></tr>`;
  }
  const statusClass = summary.failed > 0 ? 'fail' : 'pass';
  return `<tr class="${statusClass}"><td>${name}</td><td>${summary.total}</td><td>${summary.passed}</td><td>${summary.failed}</td><td>${summary.failed > 0 ? 'FAIL' : 'PASS'}</td></tr>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>DevRadar QA — Unified Report</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; color: #1a1a1a; }
  h1 { margin-bottom: 0.25rem; }
  .timestamp { color: #666; margin-bottom: 2rem; }
  table { border-collapse: collapse; width: 100%; max-width: 720px; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #e2e2e2; }
  tr.pass td:last-child { color: #1a7f37; font-weight: 600; }
  tr.fail td:last-child { color: #cf222e; font-weight: 600; }
  .muted { color: #999; }
  .links { margin-top: 2rem; }
  .links a { display: block; margin-bottom: 0.4rem; }
</style>
</head>
<body>
  <h1>DevRadar QA — Unified Report</h1>
  <p class="timestamp">Generated ${new Date().toISOString()}</p>
  <table>
    <thead><tr><th>Layer</th><th>Total</th><th>Passed</th><th>Failed</th><th>Status</th></tr></thead>
    <tbody>
      ${row('Backend (Cucumber.js)', backend)}
      ${row('Web (Playwright + playwright-bdd)', web)}
      ${row('Mobile (Detox/Maestro)', {}, mobile.available ? mobile.status : 'not run this pass (see mobile-tests/README.md)')}
    </tbody>
  </table>
  <div class="links">
    <a href="./backend-report.html">Backend — full Cucumber HTML report</a>
    <a href="./web-html/index.html">Web — full Playwright HTML report</a>
    <a href="./mobile/">Mobile — Detox artifacts (when RUN_MOBILE=true)</a>
  </div>
</body>
</html>
`;

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORTS_DIR, 'index.html'), html);
console.log(`Merged report written to ${path.join(REPORTS_DIR, 'index.html')}`);

const anyFailed = backend.failed > 0 || web.failed > 0 || mobile.status === 'FAIL';
process.exitCode = anyFailed ? 1 : 0;
