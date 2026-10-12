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

## Web verification (2026-10-04, real browser, `npm run export:web` + `npx serve dist -l 8091`)

Every screen was loaded and interacted with in a production web build
(509 modules, 1.81 MB, `fix-web-bundle.js` applied; second scan clean):

- Onboarding (language toggle, role select, finish) → sign-in (demo mode)
- Trips list → trip detail (schedule, checklist, ratings, join) → voice-call
  screen
- Maps / offline-maps tab, Chat tab (messages, reactions, location pin),
  Profile tab (identity, car, subscription)
- SOS overlay (6 reason types, cancel)
- Subscriptions (3 tiers, sponsors, demo notice)
- Settings (Notifications / Privacy / Theme / Language / External Services /
  Help / About) — i18n confirmed in both ar and en
- Admin panel: all 8 sections (trips moderation, subscriptions + MRR,
  pricing, admins, analytics, audit log, tickets, users)

Zero console/page errors during a clean-load full tab tour.
`npm run test:ci` (37/37), `tsc --noEmit`, and the web export all pass.
Lint reports 5 pre-existing errors (3× `__dirname` in `scripts/*.js`,
2× `react/no-unescaped-entities` in `AdminPanel.tsx`) — none introduced
by the changes in this branch.

## Still not verified

- Native iOS/Android builds have not been run since the `react-dom` bump.
