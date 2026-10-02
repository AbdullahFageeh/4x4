/**
 * Screenshot the exported web bundle and dump what rendered.
 * Usage: node scripts/shoot-web.js [url] [outfile]
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const URL = process.argv[2] || 'http://127.0.0.1:8091/index.html';
const OUT = process.argv[3] || path.join(__dirname, '..', 'bronco-screenshot.png');

function findChrome() {
  const cache = path.join(process.env.HOME || '', '.cache/puppeteer');
  const sysChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(sysChrome)) return sysChrome;
  if (!fs.existsSync(cache)) {
    throw new Error('No Chromium found. Run: npx puppeteer browsers install chrome');
  }

  const families = ['chrome', 'chrome-headless-shell'];
  const candidates = [];
  for (const family of families) {
    const famDir = path.join(cache, family);
    if (!fs.existsSync(famDir)) continue;
    for (const build of fs.readdirSync(famDir)) {
      const buildDir = path.join(famDir, build);
      if (!fs.statSync(buildDir).isDirectory()) continue;
      const rels = [
        path.join('chrome-mac-arm64', 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        path.join('chrome-headless-shell-mac-arm64', 'chrome-headless-shell'),
        path.join('chrome-linux64', 'chrome'),
        path.join('chrome-headless-shell-linux64', 'chrome-headless-shell'),
      ];
      for (const rel of rels) {
        const bin = path.join(buildDir, rel);
        if (fs.existsSync(bin)) {
          candidates.push({ bin, mtime: fs.statSync(buildDir).mtimeMs });
        }
      }
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  if (!candidates.length) {
    throw new Error('No Chromium binary found. Run: npx puppeteer browsers install chrome');
  }
  return candidates[0].bin;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200));
  });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 5000));

  await page.screenshot({ path: OUT, fullPage: true });

  const data = await page.evaluate(() => {
    const txt = (document.body.innerText || '').trim();
    const root = document.getElementById('root');
    const texts = Array.from(document.querySelectorAll('h1,h2,h3,h4,p,span,[class]'))
      .map((el) => (el.innerText || '').trim())
      .filter((t) => t && t.length > 1 && t.length < 120)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 60);
    return { txt: txt.slice(0, 4000), rootChildren: root ? root.children.length : -1, texts };
  });

  console.log('ERRORS:', errors.length ? errors.slice(0, 8) : 'none');
  console.log('ROOT CHILDREN:', data.rootChildren);
  console.log('\n=== VISIBLE TEXT ===\n' + (data.txt || '(empty)'));
  console.log('\n=== TEXT NODES ===');
  data.texts.forEach((t) => console.log('  •', t));
  console.log('\nSCREENSHOT:', OUT);

  await browser.close();
})();