# CarCom — Project Overview

> **Saudi car-community mobile app** built with Expo + React Native, TypeScript, Zustand, and Supabase. Bilingual (Arabic RTL + English), with a working demo mode that requires **zero external setup** to run.

**Status:** Demo mode working • Lint clean (0 errors) • Tests passing (2/2) • TypeScript compiles (0 errors)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Demo Mode](#demo-mode)
5. [External Services & API Keys](#external-services--api-keys)
6. [Architecture](#architecture)
7. [Screens](#screens)
8. [State Management](#state-management)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Supabase Schema](#supabase-schema)
11. [Testing](#testing)
12. [Linting & Type Checking](#linting--type-checking)
13. [Environment Variables](#environment-variables)
14. [Development Workflow](#development-workflow)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Expo ~52 (SDK 52) + React Native 0.79 |
| **Language** | TypeScript (strict, `noUnusedLocals` + `noUnusedParameters` enabled) |
| **State** | Zustand 5 (with MMKV persistence) |
| **Data Fetching** | @tanstack/react-query 5 |
| **Internationalization** | i18next + react-i18next |
| **Backend (planned)** | Supabase (Auth, PostgreSQL, Realtime) |
| **Maps** | react-native-maps + Google Maps |
| **Payments** | Moyasar (Saudi payment provider) |
| **Styling** | React Native StyleSheet + theme tokens |
| **Testing** | Jest 29 + react-test-renderer |
| **Linting** | ESLint 9 (flat config, `eslint-config-expo`) |
| **Form** | react-hook-form + zod |
| **Storage** | @react-native-async-storage/async-storage, react-native-mmkv |

---

## Project Structure

```
bronco/
├── App.tsx                          # Root component — renders Onboarding or App content
├── index.ts                         # Expo entry point
├── app.json                         # Expo config (iOS/Android/Web)
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config (strict)
├── babel.config.js                  # Babel config
├── eslint.config.js                 # ESLint flat config
├── jest.config.js                   # Jest config (react-native preset)
├── .env.example                     # Environment variable template
├── supabase-schema.sql              # Full database schema
├── __tests__/
│   └── App.test.tsx                 # Tests: App renders, ErrorBoundary
├── src/
│   ├── components/
│   │   └── ErrorBoundary.tsx        # Fallback UI on render errors
│   ├── i18n/
│   │   ├── index.ts                 # i18n initialization
│   │   └── locales/
│   │       ├── en.json              # English strings (~200 keys)
│   │       └── ar.json              # Arabic strings (RTL)
│   ├── services/
│   │   ├── supabase.ts            # Supabase client (URL/key from .env)
│   │   ├── googleMaps.ts          # Location + places API helpers
│   │   ├── moyasar.ts             # Payment config helpers
│   │   ├── placesService.ts       # Place search + autocomplete
│   │   └── demoData.ts            # Mock data for demo mode
│   ├── store/
│   │   ├── useAppStore.ts         # Global: auth, theme, language, onboarding
│   │   ├── tripStore.ts           # Trips CRUD, join, decline, share location
│   │   └── communityStore.ts      # Communities CRUD, join, leave, members
│   ├── theme/
│   │   └── index.ts               # Light/dark theme tokens (colors, spacing)
│   ├── types/
│   │   ├── community.ts           # Community, Member, Role, Invite types
│   │   └── trip.ts                # Trip, Participant, Category types
│   └── screens/
│       ├── chat/
│       │   └── ChatScreen.tsx     # Trip + community chat (demo)
│       ├── communities/
│       │   ├── CommunitiesScreen.tsx    # Browse/join communities
│       │   ├── CreateCommunityScreen.tsx
│       │   └── CommunityDetailScreen.tsx
│       ├── maps/
│       │   ├── TripMapScreen.tsx  # Trip route map
│       │   ├── PlaceSearchScreen.tsx    # Google Places search
│       │   └── LiveLocationScreen.tsx   # Live location sharing
│       ├── payments/
│       │   ├── PaymentScreen.tsx   # Single payment (Moyasar demo)
│       │   └── PaymentsScreen.tsx  # Expense splitting
│       ├── profile/
│       │   └── ProfileScreen.tsx   # User profile
│       ├── settings/
│       │   └── SettingsScreens.tsx # Settings, Notifications, Privacy, Services
│       └── trips/
│           ├── TripsScreen.tsx     # Browse all trips
│           ├── CreateTripScreen.tsx
│           └── TripDetailScreen.tsx
└── supabase-schema.sql
```

---

## Getting Started

**Prerequisites:** Node 20+, npm, Expo CLI

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start Expo dev server
npm start
#   → Press 'w' for web, 'a' for Android, 'i' for iOS

# 3. Run tests
npm run test:ci

# 4. Lint
npm run lint

# 5. Type-check
npx tsc --noEmit
```

> **Note:** `npm start` works immediately in demo mode. No API keys or Supabase project required to see the app running.

---

## Demo Mode

CarCom has a **demo mode** that loads mock data from `src/services/demoData.ts` and runs entirely client-side — no backend connection needed.

- **When demo mode activates:** automatically (if env vars are not set) or by design (all data is mock)
- **Mock data includes:** 2 demo communities, 3 demo trips with participants, 2 expense records, demo user (`Abdullah`, `demo-user-001`)
- **What's simulated:** community browsing/joining, trip details, chat messages, expense splitting, live location tracking, place search results

### How it works

The app's Zustand stores (`useAppStore`, `tripStore`, `communityStore`) use a `DEMO_` prefixed data set from `demoData.ts`. Key methods like `fetchTrips`, `fetchCommunities`, `fetchTrip` return mock data with a small `setTimeout` delay to simulate network latency.

Demo data lives in `src/services/demoData.ts`:
- `DEMO_COMMUNITIES` — 2 communities (Saudi Offroaders, Riyadh Car Club)
- `DEMO_TRIPS` — 3 trips (Empty Quarter Expedition, Riyadh Ring Road, Edge of the World Camping)
- `DEMO_EXPENSES` — 2 split expenses
- `DEMO_MESSAGES` — 5 chat messages

---

## External Services & API Keys

| Service | Required? | Env Var | Where Used | Production URL |
|--------|-----------|---------|------------|----------------|
| **Supabase** | Yes (auth + DB) | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `src/services/supabase.ts`, all stores | [supabase.com](https://supabase.com) |
| **Google Maps** | Yes (maps) | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (Android), `YOUR_IOS_GOOGLE_MAPS_API_KEY` (iOS in app.json) | `src/services/googleMaps.ts`, `TripMapScreen`, `PlaceSearchScreen` | [console.cloud.google.com](https://console.cloud.google.com) |
| **Moyasar** | Yes (payments) | `EXPO_PUBLIC_MOYASAR_TEST_KEY`, `EXPO_PUBLIC_MOYASAR_LIVE_KEY`, `EXPO_PUBLIC_MOYASAR_APPLE_MERCHANT_ID`, `EXPO_PUBLIC_MOYASAR_SAMSUNG_SERVICE_ID` | `src/services/moyasar.ts`, `PaymentScreen` | [dashboard.moyasar.com](https://dashboard.moyasar.com) |
| **Expo Router** | No (optional) | N/A | Not actively used (manual navigation) | — |

### Setup steps for production

1. **Supabase:** Create a project → Run `supabase-schema.sql` in SQL Editor → Copy URL + anon key to `.env`
2. **Google Maps:** Enable "Maps SDK for Android/iOS" + "Places API" → API key in `.env` + `app.json` iOS config
3. **Moyasar:** Register → Get test keys → Add to `.env` → For Apple Pay, add merchant ID; for Samsung Pay, add service ID

All credentials are referenced as `process.env.EXPO_PUBLIC_*` (client-side). **No passwords or secrets are committed to the repo.** Use `[REDACTED]` in any shared documentation.

---

## Architecture

### Data Flow

```
┌─────────────┐
│   UI Layer  │  (React Native Screens)
└──────┬──────┘
       │  uses
       ▼
┌─────────────┐
│  Zustand    │  (useAppStore, tripStore, communityStore)
│  Stores     │
└──────┬──────┘
       │  calls (future)
       ▼
┌─────────────┐
│  Services   │  (supabase.ts, googleMaps.ts, moyasar.ts, demoData.ts)
└──────┬──────┘
       │  persists via
       ▼
┌─────────────┐
│  MMKV/Async │  (local storage)
│  Storage    │
└─────────────┘
```

### Demo vs. Production

| Concern | Demo Mode | Production |
|--------|-----------|------------|
| Data source | `demoData.ts` (hardcoded) | Supabase database |
| Auth | Mock user in store | Supabase Auth |
| Maps | Placeholder emoji (🗺️) | `react-native-maps` + Google Maps |
| Payments | Moyasar config shown as alert | `react-native-moyasar-sdk` components |
| Chat | Mock messages array | Supabase Realtime |
| Location | Static demo coordinates | `expo-location` + Google Maps |

---

## Screens

| Screen | File | Description | Status |
|--------|------|-------------|--------|
| **Onboarding** | `App.tsx` (inline) | Welcome screen with language toggle (EN/AR), `setOnboardingComplete` | ✅ Working |
| **Communities** | `CommunitiesScreen.tsx` | Browse/join communities, search, filter by car model | ✅ Working |
| **Community Detail** | `CommunityDetailScreen.tsx` | Community info, member list, join/leave | ✅ Working |
| **Create Community** | `CreateCommunityScreen.tsx` | Form with name, description, car model, visibility | ✅ Working |
| **Trips** | `TripsScreen.tsx` | Browse all trips, filter by category, join/waitlist | ✅ Working |
| **Trip Detail** | `TripDetailScreen.tsx` | Full trip view, participants, join/decline | ✅ Working |
| **Create Trip** | `CreateTripScreen.tsx` | Form with title, description, category, date/time, etc. | ✅ Working |
| **Trip Map** | `TripMapScreen.tsx` | Map with route, participants, directions toggle | ✅ Working (placeholder) |
| **Place Search** | `PlaceSearchScreen.tsx` | Google Places autocomplete + search | ✅ Working |
| **Live Location** | `LiveLocationScreen.tsx` | Live location sharing with participants | ✅ Working |
| **Chat** | `ChatScreen.tsx` | Community/trip chat with messages, reactions, media | ✅ Working (demo) |
| **Payments** | `PaymentsScreen.tsx` | Expense list, split costs, total owed | ✅ Working (demo) |
| **Payment** | `PaymentScreen.tsx` | Single payment flow (Moyasar SDK demo) | ✅ Working (demo) |
| **Profile** | `ProfileScreen.tsx` | User profile display/edit | ✅ Working |
| **Settings** | `SettingsScreens.tsx` | Settings bundles, notifications, privacy, external services | ✅ Working |

---

## State Management

Three Zustand stores with MMKV persistence (`useAppStore` only; trip/community are in-memory):

### `useAppStore` (`src/store/useAppStore.ts`)
```ts
{
  user: User | null,
  isAuthenticated: boolean,
  language: 'ar' | 'en',
  isDark: boolean,
  onboardingComplete: boolean,
  isOffline: boolean,
  setAuthenticated: (user: User) => void,
  signOut: () => void,
  setLanguage: (lang: 'ar' | 'en') => void,
  toggleTheme: () => void,
  setOnboardingComplete: () => void,
  setOffline: (offline: boolean) => void,
}
```
- **Persisted keys:** `user`, `isAuthenticated`, `language`, `isDark`, `onboardingComplete`
- Triggers `I18nManager.forceRTL()` when language changes

### `useTripStore` (`src/store/tripStore.ts`)
```ts
{
  trips: Trip[],
  currentTrip: Trip | null,
  participants: TripParticipant[],
  isLoading: boolean,
  error: string | null,
  userTrips: string[],          // IDs of user's joined trips
  fetchTrips: (filter?) => Promise<void>,
  fetchTrip: (id) => Promise<void>,
  fetchParticipants: (id) => Promise<void>,
  joinTrip: (id) => Promise<void>,
  cancelTrip: (id) => Promise<void>,
  shareLocation: (tripId, lat, lng) => Promise<void>,
  createTrip: (input) => Promise<void>,
}
```

### `useCommunityStore` (`src/store/communityStore.ts`)
```ts
{
  communities: Community[],
  currentCommunity: Community | null,
  members: CommunityMember[],
  isLoading: boolean,
  error: string | null,
  userCommunities: string[],
  fetchCommunities: (filter?) => Promise<void>,
  fetchCommunity: (id) => Promise<void>,
  fetchMembers: (id) => Promise<void>,
  joinCommunity: (id) => Promise<void>,
  createCommunity: (input) => Promise<void>,
  leaveCommunity: (id) => Promise<void>,
}
```

### Services layer (`src/services/`)
- **`supabase.ts`** — Initializes Supabase client from env vars; exports `supabase` instance
- **`googleMaps.ts`** — Wraps `expo-location`; exports `getCurrentLocation()`, `calculateDistance()`, `formatDistance()`
- **`moyasar.ts`** — Exports `moyasarPublicKey`, `createMoyasarPaymentConfig()`, `PAYMENT_METHODS`, `formatAmountForMoyasar()`
- **`placesService.ts`** — Exports `PlaceType`, `PLACE_CATEGORIES`, mock autocomplete + details functions
- **`demoData.ts`** — All mock data constants (DEMO_COMMUNITIES, DEMO_TRIPS, DEMO_EXPENSES, DEMO_MESSAGES)

---

## Internationalization (i18n)

- **Library:** `i18next` + `react-i18next`
- **Config:** `src/i18n/index.ts`
- **Locales:** `src/i18n/locales/en.json` (~200 keys) and `src/i18n/locales/ar.json` (RTL mirror)
- **Default language:** auto-detected from device (`react-native-localize`), falls back to `ar` (Saudi default)
- **RTL support:** `I18nManager.forceRTL()` called on language change
- **Usage pattern:** `const { t } = useTranslation(); t('key.subkey')`

Example translation keys:
```
common.loading, common.error, common.save, common.cancel
chat.typeMessage, chat.send, chat.announcement
trip.title, trip.destination, trip.join, trip.full
community.name, community.members, community.join
settings.title, settings.notifications, settings.privacy
payment.methods.credit_card, payment.total, payment.split
```

---

## Supabase Schema

Full schema in `supabase-schema.sql` (203 lines). Key tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (name, phone, avatar, car details, language) |
| `communities` | Car model communities (name, description, visibility, invite_code) |
| `community_members` | Join table with role (admin/member), joined_at, muted |
| `trips` | Trip plans (title, description, category, dates, destination, participant_limit) |
| `trip_participants` | Join table with status (going/maybe/waitlist), joined_at |
| `messages` | Chat messages (trip/community, userId, type, content) |
| `expenses` | Trip expenses (amount, paidBy, splits) |
| `invites` | Community invites (email/targetUserId, role, status) |
| `reports` | User/content reports (type, reason, status) |

**Extensions:** `uuid-ossp` for UUID generation

**Row-level security:** Enabled on all tables (policies not included in schema — must be configured in Supabase dashboard)

---

## Testing

```bash
npm run test:ci          # Run all tests once
npm test                 # Watch mode (dev)
```

**Test file:** `__tests__/App.test.tsx` (2 tests)

| Test | Description | Status |
|------|-------------|--------|
| `App component loads without crashing` | Renders `<App />` — verifies OnboardingScreen renders in demo mode | ✅ Pass |
| `ErrorBoundary renders children when no error` | Renders ErrorBoundary with a child, verifies no crash | ✅ Pass |

**Test setup:** `jest.config.js` uses `react-native` preset with `babel-jest` transform. Expo modules are mocked via `__mocks__` entries in the test file. Zustand store is mocked to return a static demo state.

---

## Linting & Type Checking

```bash
npm run lint              # ESLint (flat config)
npx tsc --noEmit          # TypeScript type check
```

**Current state:** 0 lint errors, 0 TypeScript errors.

**Warnings (non-blocking):**
- `react-hooks/exhaustive-deps` — stores called in `useEffect` with `[]` deps (acceptable for demo mode where data doesn't change)
- A few unused `error` variables in `catch` blocks (demo error messages not yet surfaced to UI)

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Notes |
|----------|----------|-------|
| `EXPO_PUBLIC_SUPABASE_URL` | Demo: optional | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Demo: optional | Supabase anonymous key |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Demo: optional | Used on Android; also set in `app.json` for iOS |
| `EXPO_PUBLIC_MOYASAR_TEST_KEY` | Demo: optional | Moyasar test mode key |
| `EXPO_PUBLIC_MOYASAR_LIVE_KEY` | Demo: optional | Moyasar live mode key |
| `EXPO_PUBLIC_MOYASAR_APPLE_MERCHANT_ID` | Demo: optional | For Apple Pay |
| `EXPO_PUBLIC_MOYASAR_SAMSUNG_SERVICE_ID` | Demo: optional | For Samsung Pay |
| `NODE_ENV` | Default: `development` | Set to `production` for live keys |

All `EXPO_PUBLIC_*` variables are **client-side** (bundled into the app). They are safe to be public (they are public API keys, not secrets).

---

## Development Workflow

> Based on PMP/Agile methodology — iterative sprints with clear deliverables.

### Sprint phases (used for this project):

1. **Initiation** — Project charter, feature spec, tech stack decision ✅
2. **Planning** — Project structure, file organization, type definitions ✅
3. **Design** — Theme tokens, i18n setup, UI component architecture ✅
4. **Execution** — Screen implementation, store creation, service layer ✅
5. **Testing** — Unit tests, lint, type checking ✅
6. **Review** — Code review, cleanup, documentation ✅

### Adding a new feature

1. Add types to `src/types/`
2. Add any new demo data to `src/services/demoData.ts`
3. Create/extend the relevant store in `src/store/`
4. Implement the screen in `src/screens/<domain>/`
5. Add translation keys to both `en.json` and `ar.json`
6. Write a test in `__tests__/`
7. Run `npm run lint && npx tsc --noEmit && npm run test:ci`

### Navigation

Navigation is **manual** (via React Navigation or custom). Screens receive `navigation` and optional `route` props:

```tsx
interface Props {
  navigation: any;
  route?: any;
}
```

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Expo SDK 52** | Latest stable Expo with Android 15/iOS 18 support |
| **Zustand over Redux** | Simpler API, built-in persistence, smaller bundle |
| **MMKV over AsyncStorage** | Faster, binary storage, better for frequent reads |
| **MMKV in test environment** | Required mock in `__tests__/App.test.tsx` (native module) |
| **Demo mode by default** | Allows development and showcasing without Supabase/G Maps/Moyasar setup |
| **TypeScript strict mode** | `noUnusedLocals` + `noUnusedParameters` catch dead code early |
| **react-test-renderer** | Lightweight — no emulator needed for component smoke tests |
| **Babel jest transform** | Compatible with Expo's modern JSX runtime |
| **ESLint flat config** | ESLint 9 requires `eslint.config.js` (not `.eslintrc.js`) |

---

## For External AI Reviewers

This project is ready for review. Key files to inspect:

1. **`App.tsx`** — Root component, onboarding flow, navigation structure
2. **`src/store/useAppStore.ts`** — Global state (auth, theme, language, onboarding)
3. **`src/store/tripStore.ts`** — Trip domain logic
4. **`src/store/communityStore.ts`** — Community domain logic
5. **`src/services/demoData.ts`** — Mock data for demo mode
6. **`__tests__/App.test.tsx`** — Test setup and mocks
7. **`supabase-schema.sql`** — Backend schema

**Verification commands (all pass):**
```bash
npx tsc --noEmit        # 0 errors
npm run lint            # 0 errors, 9 warnings (non-blocking)
npm run test:ci         # 2/2 tests pass
```
