# Ford Bronco Edition — working notes

Dedicated Ford Bronco version of CarCom, branched from `main`.
Branch: `feature/ford-bronco` (pushed to origin).

## Run the web build

```bash
npm install
npm run export:web     # expo export + post-export bundle repair
npm run web            # serve dist at http://localhost:8091
```

Native is unchanged:

```bash
npm run ios
npm run android
```

## What was fixed to get web rendering

Two independent bugs, both real (not workarounds):

1. **`react-dom` was pinned to `18.3.1` while `react` was `19.0.0`.**
   React 19 removed `__SECRET_INTERNALS…ReactCurrentBatchConfig`, which
   react-dom 18 requires at import time. Bumped `react-dom` to `19.0.0`.

2. **Metro's web serializer emits the interop helper as an ESM namespace**
   (`{__esModule:true, default: fn}`) but generates factories that *invoke*
   it as a function — `var o=r(d[0]); … o(r(d[1]))`. That throws
   `o is not a function` before React ever mounts.
   `scripts/fix-web-bundle.js` rewrites those call sites to read `.default`.

### Why the fix script looks the way it does

Each of these was a real bug in an earlier attempt — don't "simplify" them away:

- **Only unwrap where the binding is actually invoked.** A property read like
  `w.ReactCurrentBatchConfig` must keep its namespace, or React internals
  break with `Cannot read properties of undefined`.
- **The interop module id is not stable.** It shifts between builds with
  graph order, so match on the helper's *body*, never a hardcoded id.
- **It appears at any dep index**, not just index 0.
- **Dep maps come in two shapes**: `[1,2,3]` and `{"0":1,"1":2}`.
- **Unparseable dep entries become `-1`, not `NaN`.** One stray key
  (a trailing `paths:{…}`) previously produced a `NaN` that aborted the whole
  factory and silently skipped every real dep inside it.
- **Do not touch the runtime's `o={}` sentinel.** Each factory declares its own
  `var o=…` that shadows it; editing the sentinel breaks `importedAll:o`
  references and turns the error into `o is not defined`.

## Verifying without a browser

```bash
node scripts/verify-web-bundle.js
```

Evaluates the bundle in jsdom and asserts React mounts into `#root`. This
catches both bugs above without needing Chrome — use it first, since a
screenshot failure is ambiguous.

```bash
node scripts/shoot-web.js   # screenshot + DOM dump (needs a Chromium binary)
```

## Not yet verified

- Only the onboarding screen has been rendered. The remaining client screens
  and the admin panel have not been visually checked.
- Native iOS/Android builds have not been run since the `react-dom` bump.
