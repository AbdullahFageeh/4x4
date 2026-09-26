# Bronco Edition 🛻🏜️

**Dedicated Ford Bronco version of CarCom** — Saudi car-community app built for the Ford Bronco crew in KSA.

Branch: `feature/ford-bronco` (forked from `4x4` main).

Built with **Expo SDK 52** + **Supabase** + **Google Maps** + **Moyasar** + **Zustand**.

---

## What's in this edition

### Client app
1. ✅ **Role-based view/functionality** — member / organizer / community admin / platform admin (switch roles from profile)
2. ✅ **Trips** — Bronco-themed trip feed with categories, costs, participants
3. ✅ **Chats** — community + trip channels (reused CarCom chat with reactions)
4. ✅ **Payments** — Moyasar (mada, Apple Pay, STC Pay)
5. ✅ **Voice communication** — live trip voice channel (`VoiceCallScreen`)
6. ✅ **Onboarding** — 3-step Bronco onboarding with role selection
7. ✅ **User profile** — full person info (name, phone, ID, city, club) + car info (model, year, color, engine, drive type, plate, mods, last service)
8. ✅ **Offline map** — region downloads with progress, offline-mode banner
9. ✅ **SOS button** — floating SOS alerts nearest organizer/admins with location + type (stuck, accident, medical, flat tire, no fuel)
10. ✅ **Sponsors** — featured + mini sponsor cards with CTAs
11. ✅ **Subscriptions** — Free / Pro / Elite tiers with live pricing
12. ✅ **Live location** — toggle in trip detail, indicator in header
13. ✅ **Trip reviews** — 1–5 star rating + comment per trip

### Admin panel (8 pages)
1. ✅ **Trips** — approve / cancel with audit log
2. ✅ **Subscriptions** — active count, MRR, per-user status
3. ✅ **Pricing** — editable SAR prices for Pro/Elite
4. ✅ **Admins with permissions** — add admins, permission chips, activate/deactivate
5. ✅ **Analytics** — KPI cards, weekly bar chart, trip-category donut
6. ✅ **Audit logs** — immutable action trail
7. ✅ **Support tickets** — priority levels, open → in progress → resolved
8. ✅ **Manage users** — list, impersonate ("try as user"), deactivate

### Design
- **Bronco orange** (`#C8440B`) + desert-sand palette, light & dark themes
- Arabic-first RTL layout, English switchable in onboarding
- Works in **demo mode** with zero API keys (any sign-in credentials accepted)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development

```bash
npx expo start
```

Sign in with **any phone + password** (demo mode). Onboarding starts you as **عبدالله الفقي** (platform admin) so the ⚙️ admin panel is reachable immediately. Switch roles from **حسابي → تبديل الدور** to see role-based views.

---

## Structure (new in this branch)

```
src/bronco/
├── types.ts              # roles, car, subs, SOS, reviews, tickets, audit...
├── theme.ts              # Bronco orange / desert palette (light + dark)
├── demoData.ts           # demo users, reviews, sponsors, plans, tickets, logs
├── broncoStore.ts        # Zustand + MMKV: role, subs, SOS, offline maps, voice, audit
├── components/
│   └── SOSOverlay.tsx    # floating SOS button + bottom sheet
├── screens/
│   ├── BroncoOnboarding.tsx
│   ├── BroncoTripsScreen.tsx
│   ├── BroncoTripDetailScreen.tsx   # live location, voice, reviews
│   ├── BroncoProfileScreen.tsx      # person + car + role switch
│   ├── SubscriptionsScreen.tsx      # plans + sponsors
│   ├── OfflineMapsScreen.tsx        # region downloads + live sharing
│   └── VoiceCallScreen.tsx
└── admin/
    ├── AdminPanel.tsx        # trips / subs / pricing
    └── AdminPanelPart2.tsx   # admins / analytics / audit / tickets / users
```

---

## Service Setup

Same as the base CarCom repo — Supabase (auth + DB + realtime), Google Maps Platform, Moyasar. See `supabase-schema.sql` and `.env.example`.

| Layer | Technology |
|-------|------------|
| **Framework** | Expo SDK 52, React Native 0.79+, TypeScript |
| **Backend** | Supabase (Postgres, Auth, Realtime, Storage) |
| **Maps** | Google Maps Platform via react-native-maps |
| **Payments** | Moyasar (mada, Apple Pay, STC Pay, cards) |
| **State** | Zustand with MMKV persistence |
| **Data** | TanStack Query (React Query) |
| **i18n** | i18next (Arabic RTL + English) |
| **Theme** | Bronco orange / desert palette, light & dark |

## Demo Mode

The app works **without any API keys** using hardcoded Saudi-themed demo content. All demo screens are clearly marked with 🎬 badge.

To activate real services:
1. Add keys to `.env`
2. Run Supabase schema
3. Restart: `npx expo start --clear`

## Security

- ✅ **Row Level Security** on all Supabase tables
- ✅ **No secrets in code** — all keys via `.env`
- ✅ **Demo mode** prevents accidental real transactions
- ✅ **Test mode** for Moyasar until merchant approval
- ✅ **Location permissions** require explicit user consent

## Building for Production

```bash
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

## License

TBD — private project for the Saudi Bronco community.