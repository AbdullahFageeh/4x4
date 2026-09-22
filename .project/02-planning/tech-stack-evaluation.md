# Technology Stack Evaluation

## Decision: React Native + TypeScript

### Options Evaluated

| Criteria | React Native + TS | Flutter | Native (Swift/Kotlin) | Expo Managed |
|----------|-------------------|---------|----------------------|--------------|
| Cross-platform | ✅ iOS+Android | ✅ iOS+Android | ❌ Two codebases | ✅ iOS+Android |
| Arabic RTL support | ✅ Excellent (I18nManager) | ✅ Good | ✅ Native | ✅ Good |
| Google Maps integration | ✅ react-native-maps | ✅ google_maps_flutter | ✅ Native SDKs | ⚠️ Limited |
| Real-time chat | ✅ Stream/Firebase | ✅ Same | ✅ Same | ✅ Same |
| Background location | ✅ react-native-background-geolocation | ✅ Native modules | ✅ Full control | ⚠️ Limited |
| Offline support | ✅ SQLite/MMKV/WatermelonDB | ✅ Same | ✅ Same | ✅ Same |
| Payment integration | ✅ Stripe/mada SDKs | ✅ Same | ✅ Same | ✅ Same |
| Ecosystem maturity | ✅ Huge | ✅ Large | ✅ Mature | ✅ Good |
| Dev velocity (solo) | ✅ Fast | ✅ Fast | ❌ 2x work | ⚠️ Fast but limited |

### Selected Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React Native 0.73+ | Mature, great RTL, proven in Saudi market |
| **Language** | TypeScript | Type safety, fewer runtime bugs |
| **Navigation** | React Navigation 6 | Standard, deep linking support |
| **State Management** | Zustand + React Query | Lightweight, excellent for server state |
| **Offline DB** | WatermelonDB | SQLite-based, sync-ready, offline-first |
| **Backend** | Supabase (BaaS) | Auth, real-time, PostgreSQL, storage, edge functions — fast to build |
| **Maps** | react-native-maps + Google Maps SDK | Native performance, full Google Maps Platform |
| **Chat** | Stream Chat React Native SDK | Battle-tested real-time, offline queue, reactions |
| **Payments** | Moyasar SDK (Saudi) | mada, Apple Pay, cards — Saudi-native |
| **i18n** | i18next + react-i18next | Arabic/English, RTL switching |
| **Notifications** | Firebase Cloud Messaging | Free, reliable, cross-platform |
| **Analytics** | PostHog (self-hosted) | Product analytics, session replay |
| **CI/CD** | GitHub Actions + EAS Build | Free tier, automated builds |

### Setup Requirements (External Services)

| Service | Purpose | Key Required | Cost (MVP) |
|---------|---------|--------------|------------|
| Google Maps Platform | Maps, places, directions | API key with Places, Directions, Geocoding enabled | Free $200/month credit |
| Supabase | Backend | Project URL + anon key | Free tier (500MB) |
| Stream Chat | Real-time chat | API key + secret | Free tier (50k MAU) |
| Moyasar | Payments | API keys (test mode) | No monthly fee, per-transaction |
| Firebase | Push notifications | Server key | Free |

### Architecture Pattern
- **Feature-based folder structure** (not layer-based)
- **Container/Presenter** pattern for screens
- **Repository pattern** for data access
- **Hooks** for shared logic
- **Atomic Design** for UI components

---

## Risk Mitigations in Stack Choice

| Risk | Mitigation |
|------|------------|
| Google Maps cost | react-native-maps caches tiles; Supabase edge function proxies places queries |
| Real-time reliability | WatermelonDB queues offline messages; Stream SDK handles reconnection |
| Arabic RTL bugs | I18nManager.forceRTL() + i18next locale switching tested from day 1 |
| Payment PCI compliance | Moyasar hosts all card fields; we never touch raw card data |
| App Store rejection | Follow Apple guidelines for background location; provide usage descriptions |

---

## Approval

| Role | Decision | Date |
|------|----------|------|
| Tech Lead | ✅ React Native + TypeScript + Supabase + Stream + Moyasar | 2026-09-22 |
| Product Owner | Pending review | — |
