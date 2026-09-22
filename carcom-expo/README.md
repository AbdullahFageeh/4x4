# CarCom 🚗💨

Saudi car community app — plan trips, share expenses, share live location, and connect with fellow car enthusiasts across the Kingdom.

Built with **Expo SDK 52** + **Supabase** + **Google Maps** + **Moyasar**.

---

## Quick Start

### 1. Install Dependencies

```bash
cd carcom-expo
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual API keys (see Service Setup below)
```

### 3. Set Up Supabase Database

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase-schema.sql` → **Run**
3. Copy Project URL and anon key → paste in `.env`

### 4. Start Development

```bash
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan QR with Expo Go.

---

## Service Setup

### 🔷 Supabase (Auth + Database + Realtime + Storage)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose region closest to Saudi Arabia (e.g., `eu-central-1` or `ap-northeast-1`)
3. Wait 2-3 min for provisioning
4. **Settings → API** → copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. **SQL Editor** → paste `supabase-schema.sql` → **Run**
6. **Authentication → Providers** → enable **Phone** (for SMS OTP)

### 🗺️ Google Maps Platform

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps SDK for iOS**
   - **Maps SDK for Android**
   - **Places API**
   - **Geocoding API**
   - **Directions API**
4. **Credentials → Create Credentials → API Key**
5. Restrict the key to your app's bundle ID
6. Copy to `.env` and update `app.json` plugin section with iOS/Android keys

### 💳 Moyasar (Payments)

1. Go to [dashboard.moyasar.com](https://dashboard.moyasar.com)
2. Register for a merchant account (requires Saudi commercial registration)
3. **Settings → API Keys** → copy:
   - **Test Public Key** → `EXPO_PUBLIC_MOYASAR_TEST_KEY`
   - **Live Public Key** → `EXPO_PUBLIC_MOYASAR_LIVE_KEY`
4. For Apple Pay:
   - Create merchant ID in [Apple Developer Portal](https://developer.apple.com)
   - Register domain in Moyasar dashboard
   - `EXPO_PUBLIC_MOYASAR_APPLE_MERCHANT_ID`
5. Test mode is automatic when `NODE_ENV !== 'production'`

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 52, React Native 0.79+, TypeScript |
| **Backend** | Supabase (Postgres, Auth, Realtime, Storage) |
| **Maps** | Google Maps Platform via react-native-maps |
| **Payments** | Moyasar (mada, Apple Pay, STC Pay, cards) |
| **State** | Zustand with MMKV persistence |
| **Data** | TanStack Query (React Query) |
| **i18n** | i18next (Arabic RTL + English) |
| **Theme** | Light/Dark with Saudi green palette |

### Project Structure

```
carcom-expo/
├── App.tsx                    ← Root navigator
├── supabase-schema.sql        ← Database schema
├── .env.example               ← Environment template
├── src/
│   ├── i18n/                  ← Arabic RTL + English
│   ├── theme/                 ← Light/Dark themes
│   ├── store/                 ← Zustand stores (App, Community, Trip)
│   ├── services/              ← Supabase, Google Maps, Moyasar
│   ├── types/                 ← TypeScript interfaces
│   ├── screens/
│   │   ├── onboarding/        ← Language switcher
│   │   ├── auth/              ← Sign in, Sign up
│   │   ├── communities/       ← Discovery, Create, Detail
│   │   ├── trips/             ← Discovery, Create, Detail
│   │   ├── maps/              ← TripMap, PlaceSearch, LiveLocation
│   │   ├── chat/              ← Chat with reactions
│   │   ├── payments/          ← Moyasar demo
│   │   ├── profile/           ← Profile & stats
│   │   └── settings/          ← Notifications, Privacy, Services
│   └── components/ui/         ← Button, cards, etc.
```

### Data Flow

```
UI Screens → Zustand Stores → Services → Supabase / Google Maps / Moyasar
                ↑
         MMKV Persistence
```

### Realtime Features

- **Chat messages** via `chat_messages` table → Supabase Realtime broadcast
- **Trip participants** presence via `trip_participants` table changes
- **Community members** join/leave via `community_members` table changes

---

## Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🌐 Bilingual | ✅ | Arabic (RTL) + English, runtime switch |
| 🔐 Auth | ✅ | Phone OTP + Email via Supabase Auth |
| 🏘️ Communities | ✅ | Create, discover, join, roles |
| 🗺️ Trips | ✅ | Plan, invite, checklist, itinerary |
| 📍 Maps | ✅ | Google Maps, places, directions |
| 💬 Chat | ✅ | Community + Trip channels, reactions |
| 📍 Live Location | ✅ | Time-limited sharing, auto-expire |
| 💰 Payments | ✅ | Moyasar test mode, shared expenses |
| 🔔 Notifications | ✅ | Push via expo-notifications |
| 🔒 Privacy | ✅ | Granular visibility controls |
| 🎨 Themes | ✅ | Light/Dark/Saudi palette |

---

## Demo Mode

The app works **without any API keys** using hardcoded Saudi-themed demo content. All demo screens are clearly marked with 🎬 badge.

To activate real services:
1. Add keys to `.env`
2. Run Supabase schema
3. Restart: `npx expo start --clear`

---

## Security

- ✅ **Row Level Security** on all Supabase tables
- ✅ **No secrets in code** — all keys via `.env`
- ✅ **Demo mode** prevents accidental real transactions
- ✅ **Test mode** for Moyasar until merchant approval
- ✅ **Location permissions** require explicit user consent

---

## Building for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## License

TBD — private project for Saudi car community.
