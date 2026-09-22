# 🏁 Project Charter: CarCom (Saudi Car Communities)

> **Codename:** CarCom
> **Version:** 1.0
> **Date:** 2026-09-22
> **Status:** Active
> **Classification:** Internal — MVP Build

---

## 1. Executive Summary

CarCom is a mobile-first platform connecting car owners and enthusiasts across Saudi Arabia through shared communities, organized trips, and group experiences. Users join communities by car model, discover and plan trips (scenic drives, camping, off-road adventures, city meetups), manage shared expenses, communicate in real time, and optionally share live location during trips.

The app supports Arabic (RTL) and English, uses Saudi riyals (SAR), local phone numbers (+966), and the Asia/Riyadh time zone. It is designed for outdoor use with large controls, clear maps, and offline resilience.

---

## 2. Business Case

### Problem
Car communities in Saudi Arabia currently organize through scattered WhatsApp groups, Instagram pages, and word-of-mouth. This leads to:
- Missed coordination and last-minute chaos
- No way to track shared expenses or payments
- No trip discovery or planning tools
- Poor experience for off-road and remote area trips (weak signal, no offline support)
- Fragmented safety and accountability

### Solution
A single-purpose app that lets car enthusiasts:
- Find and join communities by car model
- Discover, create, and manage trips end-to-end
- Split and pay expenses within the app
- Communicate with dedicated trip chat
- Share live location during trips
- Use Google Maps for discovery, directions, and points of interest

### Value
- **Users:** Coordinated, fun, and safe group driving experiences
- **Organizers:** Tools to manage trips, payments, and participants
- **Business:** Foundation for future monetization (premium communities, featured destinations, booking partnerships)

---

## 3. Scope Statement

### In Scope (MVP)
1. **Bilingual support** — Arabic (RTL) and English
2. **User profiles** — Name, photo, car model, optional car details
3. **Communities** — Create/join, public/private, membership requests, invite links, organizer/member roles, rules, reporting, blocking
4. **Trips** — Create with title, description, destination, meeting point, date, time, itinerary, participant limit, cost; categories (scenic, camping, off-road, city meetups); join/decline/waitlist; participant list; updates; reminders; preparation checklist; organizer updates/cancel with notification
5. **Maps & locations** — Search, pin sharing, meeting point selection, route stops (fuel, restaurants, campsites, rest areas); Google Maps directions; place suggestions from Google Maps Platform; verified data vs community recommendations; member voting
6. **Live location sharing** — Opt-in, viewer-limited, time-limited, auto-expire, stale detection, offline cache
7. **Payments & expenses** — Trip fees, shared expenses, equal/custom splits, payment status, receipts, balance tracking; Saudi payment integration (mada, Apple Pay, cards); fee display, cancellation/refund terms; credential isolation with provider
8. **Chat & notifications** — Community chat + trip chat; text, photos, pins, replies, reactions, pinned announcements; mute; important change alerts; departure reminders; payment updates
9. **Trust & safety** — Moderation, reporting, membership controls, privacy settings, trusted contact sharing, connectivity disclaimer
10. **Core screens** — Onboarding, community discovery, community home, trip discovery, trip details, trip creation, trip map, chat, payments/expenses, user profile, notification/privacy settings
11. **States** — Loading, empty, error, offline for all screens
12. **Sample data** — Realistic Saudi sample content; demo data clearly labeled

### Out of Scope (Post-MVP)
- In-app booking/campsite reservations
- Route optimization algorithms
- Gamification/badges
- Marketplace for car parts/accessories
- iOS-only or Android-only features (cross-platform required)
- Admin dashboard (web)
- Analytics/event tracking backend

---

## 4. Success Criteria

| # | Criterion | Measure | Target |
|---|-----------|---------|--------|
| SC-1 | App is functional end-to-end | Complete main journey (join community → discover/create trip → confirm → pay → chat → share location) | 100% coverage |
| SC-2 | Bilingual support works correctly | Arabic RTL + English UI, all screens | Zero layout issues on flip |
| SC-3 | Saudi localization | SAR currency, +966 phones, Riyadh TZ, local sample data | All screens |
| SC-4 | Trip creation & management | Organizer can create, update, cancel trips with all fields | 100% functional |
| SC-5 | Payment flow | Users can see shares, pay via integrated provider, see confirmations | End-to-end (test mode) |
| SC-6 | Chat | Real-time text, photos, pins, reactions, pinned messages, mute | Functional |
| SC-7 | Live location sharing | Share, expire, stale detection, privacy controls | Functional (simulated) |
| SC-8 | Offline states | Graceful degradation, cached trip info, reconnection recovery | All critical screens |
| SC-9 | Core screens delivered | All 11 screens from spec | 11/11 |
| SC-10 | Performance | App launch < 3s, trip list load < 2s, chat message send < 1s | 90th percentile |

---

## 5. Stakeholders

| Role | Responsibility | Expectations |
|------|---------------|--------------|
| **Product Owner (Abdullah)** | Final decisions, scope control, acceptance | Feature completeness, Saudi market fit |
| **Development Team** | Architecture, build, delivery | Clean code, maintainable, on time |
| **Design/UX** | Wireframes, interaction patterns, accessibility | Arabic RTL excellence, outdoor readability |
| **QA/Testers** | Test plans, bug triage, acceptance testing | Zero critical bugs at launch |
| **End Users** | Car community members and organizers | Intuitive, reliable, fun |

---

## 6. Assumptions & Constraints

### Assumptions
- Google Maps Platform API key is available (with Places, Directions, Geocoding)
- A Saudi payment gateway (e.g., Stripe with mada support, Moyasar, or PayTabs) is available for integration
- Test/demo credentials will be used for external services; no production traffic at MVP
- Sample data for communities, trips, and places will be realistic Saudi content

### Constraints
- No production payments, live locations, or reviews — clearly simulated/demo
- Must use setup requirements for any external service (documented, not hidden)
- Offline-first design for weak-signal areas
- All UI must work in both Arabic and English

---

## 7. High-Level Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Google Maps API costs / rate limits | High | Medium | Cache aggressively, cap daily requests, document limits |
| Payment integration complexity | High | Medium | Use hosted checkout from provider; never handle raw credentials |
| Real-time chat reliability | Medium | Medium | Use managed service (Stream, Firebase, Supabase) with offline queue |
| Arabic RTL layout issues | Medium | High | Test on both languages from day one; use proven i18n library |
| Live location battery drain | Medium | Medium | Configurable intervals, background modes, user education |
| Scope creep | High | Medium | Strict MVP scope; phase gate reviews |

---

## 8. Phase-Gate Model

| Gate | Name | Entry Criteria | Exit Criteria |
|------|------|----------------|---------------|
| G0 | Charter Approval | Stakeholder sign-off | Charter approved, workspace created |
| G1 | Planning Complete | Architecture, backlog, risks defined | Sprint 1 ready to start |
| G2 | Sprint Reviews | Sprint demos completed | All P1 stories done |
| G3 | Feature Complete | All MVP features built | Integration test pass |
| G4 | UAT / QA | QA sign-off | Zero critical bugs |
| G5 | Launch Ready | G4 complete | App store submission |

---

## 9. Governance

- **Daily:** Standup-style progress check (async in tooling)
- **Weekly:** Sprint review with demo
- **Phase Gate:** Formal review before next phase begins
- **Change Control:** Any scope change requires PO approval and risk re-assessment
- **Documentation:** All decisions recorded in project log

---

## 10. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | Abdullah | 2026-09-22 | ✅ |
| Tech Lead | Hermes Agent | 2026-09-22 | ✅ |
| QA Lead | — | Pending | — |

---

*Next: Phase 1 Initiation complete → Phase 2 Planning (Architecture, Backlog, Risk Register).*
