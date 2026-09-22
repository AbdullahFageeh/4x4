# CarCom 🚗

Saudi car community app — plan trips, share expenses, and connect with fellow car enthusiasts.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 52 (React Native 0.79+) |
| **Language** | TypeScript (strict mode) |
| **Backend** | Supabase (Auth, PostgreSQL, Real-time, Storage) |
| **State** | Zustand + TanStack Query |
| **i18n** | i18next (Arabic RTL + English LTR) |
| **Maps** | Google Maps Platform |
| **Payments** | Moyasar (test mode) |

## Quick Start

```bash
# Clone and install
git clone https://github.com/AbdullahFageeh/4x4.git
cd 4x4/carcom-expo
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start the app
npm start
```

## Environment Variables

```bash
# Supabase (required for auth & DB)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Maps (required for maps)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Moyasar (required for payments)
EXPO_PUBLIC_MOYASAR_PUBLIC_KEY=your-moyasar-test-key
```

## Features (MVP)

- [x] Arabic/English onboarding and auth
- [x] Car communities (create, join, discover)
- [ ] Trips (create, discover, detail)
- [ ] Maps integration (Google Maps, places, directions)
- [ ] Real-time chat
- [ ] Live location sharing
- [ ] Shared expenses + Moyasar payments
- [ ] Notifications & moderation

## License

MIT
