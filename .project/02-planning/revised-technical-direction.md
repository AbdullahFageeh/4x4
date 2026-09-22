# 🧭 Revised Technical Direction & Project Plan

> **Date:** 2026-09-22
> **Status:** Planning Phase
> **Stack Change:** React Native CLI → **Expo** + **Supabase** + **Google Maps** + **Moyasar**

---

## 1. Reference Project Analysis

### SquadQuest (Flutter + Supabase) — MIT License
**Key patterns to adopt:**
- **Live location sharing** with trails showing direction/speed
- **RSVP states**: no, maybe, yes, OMW (on my way)
- **Interest-based event discovery** with topic subscriptions
- **Phone number auth** — simple, no passwords needed
- **Real-time presence** showing who's online
- **Event chat** with pinned announcements
- **Push notifications** via FCM
- **Live map** under each event with attendee markers

### TREK (Self-hosted Next.js) — AGPL-3.0 License
**Key patterns to adopt:**
- **Role-based permissions**: admin/owner/member/everyone for 16 actions
- **Invite links** with expiry and use limits
- **Budget management** with multi-currency and expense splitting
- **Real-time collaboration** via WebSocket sync
- **Conflict resolution**: last-write-wins with version counter
- **Offline support** with optimistic updates

### Cairn (Next.js + Supabase) — PRIVATE LICENSE
**Can only borrow ideas, NOT code:**
- Interactive route planning with elevation profiles
- Real-time collaboration with editor/viewer permissions
- Photo management tied to trip locations
- Privacy-first design (trips visible only to invited users)

### Turistar (Next.js + Supabase) — AGPL-3.0 License
**Key patterns to adopt:**
- **Event-sourced model** with versioned snapshots
- **Optimistic updates** with rollback on failure
- **Version gap detection** for client sync
- **RLS-backed permissions** (owner/admin/member/reader)
- **Controlled sharing** (private by default, public read-only URL)

### Moyasar SDK — MIT License
**Integration details:**
- Package: `react-native-moyasar-sdk`
- Peer deps: `react-native-webview`, `react-native-svg`
- Supports: Credit Card, Apple Pay, Samsung Pay, STC Pay
- Test mode: yes (no merchant approval needed)
- Saudi support: mada, Apple Pay, STC Pay

---

## 2. Revised Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Expo SDK 52+ | Faster dev, built-in config plugins, OTA updates |
| **Language** | TypeScript strict | Type safety across the stack |
| **Navigation** | Expo Router | File-based, deep linking, simpler than RN Navigation |
| **State** | Zustand + TanStack Query | Lightweight + server state caching |
| **Backend** | Supabase | Auth, PostgreSQL, Storage, Realtime, RLS, Edge Functions |
| **Maps** | react-native-maps + Google Maps SDK | Native performance, full Google Maps Platform |
| **Payments** | react-native-moyasar-sdk | Saudi-native, mada/Apple Pay/STC Pay |
| **Push Notifications** | Expo Notifications + FCM/APNs | Cross-platform, free |
| **i18n** | i18next + react-i18next | Arabic RTL + English LTR |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **CI/CD** | GitHub Actions + EAS Build | Automated builds and submissions |

---

## 3. MVP Build Order (Revised)

### Phase 1: Foundation & Auth
- [ ] Expo project scaffold with TypeScript
- [ ] Supabase project setup (auth, DB, storage)
- [ ] Arabic/English onboarding flow
- [ ] Phone number authentication via Supabase Auth
- [ ] User profile (name, photo, car model, car details)
- [ ] Theme system (light/dark, Saudi palette)

### Phase 2: Communities
- [ ] Community creation (name, description, car model, visibility, rules)
- [ ] Community discovery (search, filter, trending)
- [ ] Community membership (join, request, invite link)
- [ ] Community home (info, stats, rules, members, upcoming trips)
- [ ] Community roles (organizer, member)
- [ ] Moderation (report, block, remove)

### Phase 3: Trips
- [ ] Trip creation (title, description, category, destination, meeting point, date/time, limit, cost, itinerary, checklist)
- [ ] Trip discovery (search, filter by category)
- [ ] Trip details (full info, participants, join/decline)
- [ ] Trip management (edit, cancel, notify)
- [ ] Waitlist when full
- [ ] Participant status (going, declined, waitlisted)

### Phase 4: Maps & Places
- [ ] Google Maps integration with API key
- [ ] Trip map view (meeting point, destination, route stops)
- [ ] Place search (Google Places autocomplete)
- [ ] Directions (open in Google Maps app)
- [ ] Route stops (fuel, restaurant, campsite, rest area)
- [ ] Destination suggestions with attribution

### Phase 5: Chat
- [ ] Community chat (real-time via Supabase)
- [ ] Trip chat (dedicated channel per trip)
- [ ] Message types (text, photo, location pin)
- [ ] Pinned announcements (organizer only)
- [ ] Reactions and replies
- [ ] Mute notifications

### Phase 6: Live Location
- [ ] Background location tracking (expo-location)
- [ ] Opt-in sharing with duration limit
- [ ] Viewer selection (trip participants only)
- [ ] Auto-expire timer
- [ ] Stale location detection (no update > 15 min)
- [ ] Visible stop button always accessible

### Phase 7: Payments
- [ ] Moyasar SDK integration (test mode)
- [ ] Trip fee payment flow
- [ ] Payment methods (mada, Apple Pay, STC Pay, card)
- [ ] Shared expenses (equal/custom split)
- [ ] Receipt upload
- [ ] Refund policy display

### Phase 8: Polish & Testing
- [ ] Push notifications (Expo + FCM)
- [ ] Offline states with cached data
- [ ] Loading, empty, error states on all screens
- [ ] Privacy controls and trusted contact
- [ ] Saudi demo content (realistic)
- [ ] Security rules (RLS on all tables)

---

## 4. Supabase Schema (Draft)

### Tables
```
users (id, name, avatar_url, phone, preferred_language, car_model, car_details)
communities (id, name, description, car_model, cover_image_url, visibility, invite_code, rules, created_by)
community_members (community_id, user_id, role, status, joined_at)
trips (id, community_id, title, description, category, destination, meeting_point, route_stops, date, departure_time, estimated_return, participant_limit, current_participants, estimated_cost, status, itinerary, preparation_checklist, created_by)
trip_participants (trip_id, user_id, status, joined_at)
expenses (id, trip_id, type, title, total_amount, split_type, receipt_url, created_by)
expense_shares (expense_id, user_id, amount, status, payment_id, paid_at)
chat_channels (id, type, community_id, trip_id, created_at)
chat_messages (id, channel_id, user_id, type, content, metadata, created_at)
location_shares (id, user_id, trip_id, viewers, lat, lng, accuracy, recorded_at, expires_at, is_active)
notifications (id, user_id, type, title, body, data, read, created_at)
```

### Real-time Channels
- `community_chat:{community_id}` — community messages
- `trip_chat:{trip_id}` — trip messages
- `trip_presence:{trip_id}` — participant live status
- `location_updates:{trip_id}` — live location sharing

---

## 5. External Service Requirements

| Service | Required For | Setup Time | Cost |
|---------|--------------|------------|------|
| **Supabase** | Auth, DB, Storage, Realtime | 20 min | Free tier (500MB) |
| **Google Maps Platform** | Maps, Places, Directions | 30 min | Free $200/mo credit |
| **Moyasar** | Payments | 15 min | Test mode free |
| **Expo** | Build, OTA updates | 10 min | Free tier |
| **FCM/APNs** | Push notifications | 15 min | Free |

**Setup requirements will be clearly documented — no fake data presented as real.**

---

## 6. License Compliance

| Project | License | Can Copy? |
|---------|---------|-----------|
| SquadQuest | MIT | ✅ Yes, with attribution |
| TREK | AGPL-3.0 | ⚠️ Only ideas, not code (viral license) |
| Cairn | Private | ❌ Ideas only, no code |
| Turistar | AGPL-3.0 | ⚠️ Only ideas, not code (viral license) |
| Moyasar SDK | MIT | ✅ Yes, with attribution |

**Approach:** Study patterns from all four, reimplement in our own architecture. Do NOT copy AGPL code into a proprietary project.

---

## 7. Next Steps

1. **Create Expo project** in new directory
2. **Set up Supabase** project and configure auth
3. **Build Phase 1** (foundation + auth) end-to-end
4. **Port existing UI** (i18n, theme, screen designs) from current prototype
5. **Document external service setup** requirements clearly

---

*Plan created after analyzing SquadQuest, TREK, Cairn, Turistar, and Moyasar SDK documentation.*
