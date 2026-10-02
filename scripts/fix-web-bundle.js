/**
 * Post-export repair for the Expo SDK 52 web bundle.
 *
 * Defect: Metro's web serializer emits each factory as
 *   __d(function(g,r,i,a,m,e,d){ var o=r(d[0]); ... o(r(d[1])) ... },ID,[...])
 * where dep[0] is the synthetic interop helper, exported as an ESM namespace
 * `{__esModule:true, default: interopFn}`. The factory then *calls* that
 * namespace object -> "o is not a function", which kills the app before React
 * mounts.
 *
 * The helper's exports object cannot be made callable (a factory param is only
 * a local binding; assigning it does not mutate the real exports). So the fix
 * must be at the call sites — but ONLY where the hoisted variable is actually
 * invoked. Unconditionally unwrapping `.default` corrupts real modules whose
 * namespace happens to sit at dep[0], which breaks React internals
 * ("Cannot read properties of undefined").
 *
 * Also handles `import.meta.env`, a syntax error in the classic
 * `<script defer>` tag the Expo web template emits.
 *
 * Idempotent. Usage: `node scripts/fix-web-bundle.js [distDir]`
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(process.argv[2] || path.join(__dirname, '..', 'dist'));
const JS_DIRS = [
  path.join(DIST, '_expo', 'static', 'js', 'web'),
  path.join(DIST, '_expo', 'static', 'js'),
];

const IMPORT_META_RE = /import\.meta\.env/g;
const IMPORT_META_NEW = '({ MODE: "production" })';

/** Locate the interop helper module by its body and capture its module id. */
function findInteropModuleId(code) {
  const re =
    /__d\(function\([a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*\)\{Object\.defineProperty\([a-zA-Z_$][\w$]*,"__esModule",\{value:!0\}\),[a-zA-Z_$][\w$]*\.default=function\(e\)\{return e&&e\.__esModule\?e:\{default:e\}\}\},(\d+),\[\]\);/;
  const m = code.match(re);
  return m ? m[1] : null;
}

/**
 * Rewrite `var X=r(d[N])` to `var X=(r(d[N])).default` whenever N indexes the
 * interop helper module AND X is actually invoked (not merely property-read).
 *
 * The helper can appear at any dep index, not just 0.
 */
function patchInvokedInterop(code) {
  const interopId = findInteropModuleId(code);
  if (interopId === null) return { code, count: 0, interopId };

  // Dep maps come in two shapes depending on how the serializer emitted the
  // factory: an array `[1,2,3]` or a JSON object `{"0":1,"1":2}`. Both must be
  // recognised or large chunks of the bundle are silently skipped.
  const factoryRe =
    /__d\(function\([a-zA-Z_$][\w$]*,([a-zA-Z_$][\w$]*),[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,[a-zA-Z_$][\w$]*,([a-zA-Z_$][\w$]*)\)\{([\s\S]*?)\},(\d+),(?:\[([\d,\s]*)\]|\{([^}]*)\})/g;

  let count = 0;
  const out = code.replace(factoryRe, (match, req, deps, body, _id, arrDeps, objDeps) => {
    let depIds;
    if (arrDeps !== undefined) {
      depIds = arrDeps.split(',').map((d) => parseInt(d.trim(), 10));
    } else {
      // `{"0":1,"1":12}` — keys are indexes, values are module ids. Some
      // entries are not numeric at all (e.g. a trailing `paths:{...}`), so
      // unparseable entries become -1 rather than NaN and must not abort the
      // whole factory: one stray key would otherwise skip every real dep.
      depIds = (objDeps || '')
        .split(',')
        .map((pair) => {
          const kv = pair.match(/"(\d+)"\s*:\s*(\d+)/);
          return kv ? parseInt(kv[2], 10) : -1;
        });
    }
    if (!depIds.length) return match;

    const interopIndexes = [];
    depIds.forEach((id, i) => {
      if (id === Number(interopId)) interopIndexes.push(i);
    });
    if (!interopIndexes.length) return match;

    // Match every hoist `var X=r(d[N])` in this body.
    const hoistRe = new RegExp(
      `var ([a-zA-Z_$][\\w$]*)=${req}\\(${deps}\\[(\\d+)\\]\\)`,
      'g'
    );

    let hits = 0;
    // Function replacer: bodies may contain `$&`-style sequences that
    // String.replace would otherwise interpret as capture references.
    const newBody = body.replace(hoistRe, (whole, name, idxRaw) => {
      const idx = Number(idxRaw);
      if (!interopIndexes.includes(idx)) return whole;
      // A call is `name(` NOT preceded by `.` (that would be `obj.name(`).
      const callRe = new RegExp(`(^|[^.\\w$])${name}\\s*\\(`);
      if (!callRe.test(body)) return whole; // property read only -> leave alone
      hits++;
      const read = `${req}(${deps}[${idx}])`;
      return `var ${name}=(${read}).default`;
    });

    if (!hits) return match;
    count += hits;
    return match.replace(body, () => newBody);
  });

  return { code: out, count, interopId };
}

function collect(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return collect(full);
    return e.isFile() && e.name.endsWith('.js') ? [full] : [];
  });
}

if (!fs.existsSync(DIST)) {
  console.error(`No dist at ${DIST} — run \`npx expo export --platform web\` first.`);
  process.exit(1);
}

let total = 0;
let scanned = 0;
for (const dir of JS_DIRS) {
  const files = collect(dir);
  if (!files.length) continue;
  scanned += files.length;
  console.log(`scanning ${path.relative(process.cwd(), dir)} (${files.length})`);

  for (const file of files) {
    const before = fs.readFileSync(file, 'utf-8');
    let next = before;
    const done = [];

    const interop = patchInvokedInterop(next);
    if (interop.count > 0) {
      next = interop.code;
      done.push(`interop x${interop.count} (module ${interop.interopId})`);
    }

    const meta = (next.match(IMPORT_META_RE) || []).length;
    if (meta) {
      next = next.replace(IMPORT_META_RE, IMPORT_META_NEW);
      done.push(`import.meta x${meta}`);
    }

    const rel = path.relative(process.cwd(), file);
    if (next !== before) {
      fs.writeFileSync(file, next);
      total += done.length;
      console.log(`  patched ${rel} [${done.join(', ')}]`);
    } else {
      console.log(`  clean   ${rel}`);
    }
  }
}

if (!scanned) {
  console.error(`No JS bundles under ${DIST}`);
  process.exit(1);
}
console.log(total ? `Done. ${total} fix group(s) applied.` : 'Nothing to fix.');
console.log('Serve with:  npx serve dist -l 8091');