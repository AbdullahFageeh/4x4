/**
 * Execute the exported web bundle in a jsdom-like global environment and report
 * whether it reaches `AppRegistry.runApplication` without throwing.
 *
 * This validates the export WITHOUT a browser: we assert on module evaluation
 * succeeding, which is exactly where the "o is not a function" defect lived.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const JS_DIR = path.join(__dirname, '..', 'dist', '_expo', 'static', 'js', 'web');
const entry = fs.readdirSync(JS_DIR).find((f) => f.startsWith('AppEntry'));
if (!entry) {
  console.error('No AppEntry bundle found. Run `npm run export:web` first.');
  process.exit(1);
}

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  runScripts: 'outside-only',
});

const { window } = dom;
const errors = [];

// The bundle expects these globals to exist.
window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
window.matchMedia =
  window.matchMedia ||
  (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));

const code = fs.readFileSync(path.join(JS_DIR, entry), 'utf-8');

try {
  window.eval(code);
  console.log('BUNDLE EVALUATED: OK');
} catch (e) {
  errors.push(e);
  console.log('BUNDLE EVALUATED: FAILED');
  console.log('  ' + e.message);
  const frame = String(e.stack || '').split('\n')[1] || '';
  console.log('  at' + frame.trim());
  process.exit(1);
}

// Give React a tick to mount into #root.
setTimeout(() => {
  const root = window.document.getElementById('root');
  const text = (root.innerText || '').replace(/\s+/g, ' ').trim();
  console.log('ROOT CHILDREN:', root.children.length);
  console.log('ROOT TEXT:', text.slice(0, 600) || '(empty)');
  process.exit(0);
}, 3000);