# UI / UX Wireframes

## Design Principles

1. **Mobile-first** — Touch-friendly, thumb-reachable controls
2. **Outdoor-readable** — High contrast, large fonts, clear icons
3. **Arabic-first RTL** — All layouts tested and functional in both LTR/RTL
4. **Saudi visual identity** — Desert-inspired palette, clean and modern
5. **Accessibility** — WCAG 2.1 AA target, dynamic text sizing

---

## Screen Inventory

### 1. Onboarding (`/onboarding`)
```
┌─────────────────────────┐
│  [App Logo]             │
│                         │
│  Welcome to CarCom      │
│  مرحباً بك في كار كوم   │
│                         │
│  [Illustration: Cars]   │
│                         │
│  Find your car crew,    │
│  plan trips, and share  │
│  the road.              │
│                         │
│  ┌──────────────────┐   │
│  │  Get Started →   │   │
│  └──────────────────┘   │
│                         │
│  Already have account?  │
│       [Log in]          │
│                         │
│  Language: [AR | EN]    │
└─────────────────────────┘

States: loading, empty (first-time), error (network), logged-in → redirect
```

### 2. Auth (`/auth/sign-in`, `/auth/sign-up`)
```
┌─────────────────────────┐
│  ← Back                 │
│                         │
│  Welcome Back           │
│                         │
│  Phone Number           │
│  ┌──────────────────┐   │
│  │ +966 │            │   │
│  └──────────────────┘   │
│                         │
│  Password               │
│  ┌──────────────────┐   │
│  │ ••••••••         │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │     Sign In      │   │
│  └──────────────────┘   │
│                         │
│  Forgot password?       │
│                         │
│  Or continue with:      │
│  [Apple]  [Google]      │
└─────────────────────────┘

States: loading (submit), error (invalid creds), empty (first render)
```

### 3. Community Discovery (`/communities`)
```
┌─────────────────────────┐
│  Car Communities    [+] │
│  ─────────────────────  │
│  [Search communities]   │
│                         │
│  🔥 Trending            │
│  ┌───────┐ ┌───────┐    │
│  │ LC    │ │ Patrol│    │
│  │ Club  │ │ KSA   │    │
│  │ 👥 234│ │ 👥 189│    │
│  └───────┘ └───────┘    │
│                         │
│  📍 Near Me             │
│  ┌───────────────────┐  │
│  │ 🚗 Yota Offroad   │  │
│  │ Riyadh · 👥 56    │  │
│  │ [View] [Join]     │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 🚗 Patrol Saudi   │  │
│  │ Jeddah · 👥 89    │  │
│  │ [View] [Join]     │  │
│  └───────────────────┘  │
│                         │
│  [🏠] [🔍] [👤]        │
└─────────────────────────┘

States: loading (skeleton), empty (no communities), error (fetch fail), offline (cached)
```

### 4. Community Home (`/communities/:id`)
```
┌─────────────────────────┐
│  ← LC Club KSA     [⋯]  │
│  ─────────────────────  │
│  ┌───────────────────┐  │
│  │   [Cover Photo]   │  │
│  │  Toyota Land      │  │
│  │  Cruiser · 234    │  │
│  │  members          │  │
│  │  [Join Community] │  │
│  └───────────────────┘  │
│                         │
│  [About] [Trips] [Chat] │
│  ─────────────────────  │
│  About this community   │
│  We're LC owners across  │
│  KSA who love weekend   │
│  trips and off-road.    │
│                         │
│  📜 Rules:              │
│  • Be respectful        │
│  • No spam              │
│  • Follow traffic laws  │
│                         │
│  Upcoming Trips:        │
│  ┌───────────────────┐  │
│  │ 🏜️ Wadi Trip      │  │
│  │ Oct 5 · 12 going   │  │
│  │ [View Details]     │  │
│  └───────────────────┘  │
│                         │
│  [🏠] [🔍] [👤]        │
└─────────────────────────┘
```

### 5. Trip Discovery (`/trips`)
```
┌─────────────────────────┐
│  Discover Trips     [+] │
│  ─────────────────────  │
│  [Filter: All ▼]        │
│                         │
│  Categories:            │
│  [🏜️ Off-road] [⛺ Camp]│
│  [🌄 Scenic] [🏙️ City] │
│                         │
│  ┌───────────────────┐  │
│  │ 🏜️ Wadi Disi      │  │
│  │ Tabuk · Oct 5      │  │
│  │ 12/15 · 350 SAR    │  │
│  │ [View]             │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ ⛺ Shafa Farms    │  │
│  │ Taif · Oct 12      │  │
│  │ 8/10 · 200 SAR     │  │
│  │ [View]             │  │
│  └───────────────────┘  │
│                         │
│  [🏠] [🔍] [👤]        │
└─────────────────────────┘
```

### 6. Trip Details (`/trips/:id`)
```
┌─────────────────────────┐
│  ← Wadi Disi        [⋯] │
│  ─────────────────────  │
│  ┌───────────────────┐  │
│  │  [Trip Cover Img] │  │
│  │  🏜️ Wadi Disi     │  │
│  │  Tabuk Region     │  │
│  └───────────────────┘  │
│                         │
│  Organizer: Abdullah    │
│  Date: Sat, Oct 5, 2026 │
│  Departure: 6:00 AM     │
│  Participants: 12/15    │
│  Cost: 350 SAR/person   │
│                         │
│  ┌───────────────────┐  │
│  │  🗺️ View on Map   │  │
│  └───────────────────┘  │
│                         │
│  Description:           │
│  Off-road adventure...  │
│                         │
│  Itinerary:             │
│  6:00 AM — Meet at...   │
│  8:00 AM — Arrive...    │
│                         │
│  ┌───────────────────┐  │
│  │   Join Trip (350   │  │
│  │        SAR)        │  │
│  └───────────────────┘  │
│  [Waitlist: 0]          │
│                         │
│  👥 Going (12):         │
│  [Avatar] [Av] [Av]...  │
└─────────────────────────┘
```

### 7. Trip Creation (`/trips/create`)
```
┌─────────────────────────┐
│  ← Create Trip      [✓] │
│  ─────────────────────  │
│                         │
│  Community              │
│  [LC Club KSA       ▼]  │
│                         │
│  Title                  │
│  [________________]     │
│                         │
│  Category               │
│  [🏜️ Off-road      ▼]  │
│                         │
│  Description            │
│  [                ]     │
│  [                ]     │
│                         │
│  Destination            │
│  [Search place...  ]    │
│  [📍 Use current]       │
│                         │
│  Meeting Point          │
│  [Search place...  ]    │
│                         │
│  Date                   │
│  [Oct 5, 2026      📅]  │
│                         │
│  Departure Time         │
│  [6:00 AM          ⏰]  │
│                         │
│  Participant Limit      │
│  [15               ]    │
│                         │
│  Estimated Cost (SAR)   │
│  [350              ]    │
│                         │
│  ┌───────────────────┐  │
│  │   Create Trip     │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### 8. Trip Map (`/trips/:id/map`)
```
┌─────────────────────────┐
│  ← Wadi Disi Map    [⋯] │
│  ─────────────────────  │
│  ┌───────────────────┐  │
│  │                   │  │
│  │   [MAP VIEW]      │  │
│  │                   │  │
│  │   📍Meeting       │  │
│  │      🚗           │  │
│  │         ⬇️        │  │
│  │   ⛽Fuel          │  │
│  │         ⬇️        │  │
│  │   🏁Destination   │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  [📍 Add Stop]          │
│  ─────────────────────  │
│  Route Stops:           │
│  ⛽ Petro Station       │
│  🍽️ Al Khobar Restaurant│
│  📍 Scenic Overlook     │
│                         │
│  [🧭 Get Directions]    │
│                         │
│  ─────────────────────  │
│  Live Locations:        │
│  🟢 Abdullah (5 min ago)│
│  🔴 Mohammed (45 min)   │
│  [📍 Share My Location] │
└─────────────────────────┘
```

### 9. Chat (`/chat/:channelId`)
```
┌─────────────────────────┐
│  ← LC Club Chat     [⋯] │
│  ─────────────────────  │
│                         │
│  ┌────────────────┐     │
│  │ Sara: Anyone   │     │
│  │ going Friday?  │     │
│  └────────────────┘     │
│                         │
│       ┌────────────────┐│
│       │ You: Yes!      ││
│       │ 👍 2  ❤️ 1      ││
│       └────────────────┘│
│                         │
│  ┌────────────────┐     │
│  │ Omar: 📍 Meet  │     │
│  │ at Riyadh      │     │
│  │ Park           │     │
│  └────────────────┘     │
│                         │
│  📌 Pinned: Next trip   │
│  Oct 5 · Wadi Disi      │
│                         │
│  [📷] [📍]              │
│  [Type message... ] [➤]│
└─────────────────────────┘
```

### 10. Payments & Expenses (`/trips/:id/payments`)
```
┌─────────────────────────┐
│  ← Expenses         [+] │
│  ─────────────────────  │
│                         │
│  Trip Fee: 350 SAR      │
│  Your share: 350 SAR    │
│  Status: ⚠️ Pending     │
│                         │
│  ┌───────────────────┐  │
│  │   Pay Now (350    │  │
│  │        SAR)       │  │
│  └───────────────────┘  │
│                         │
│  Payment Methods:       │
│  [mada] [Apple Pay] [💳]│
│                         │
│  ─────────────────────  │
│  All Expenses:          │
│                         │
│  Trip Fee               │
│  Total: 350 SAR         │
│  Paid: 10/12            │
│                         │
│  Campsite Booking       │
│  Total: 500 SAR         │
│  Per person: 50 SAR     │
│  [📷 Receipt]           │
│                         │
│  ─────────────────────  │
│  Participants:          │
│  ✅ Abdullah (paid)     │
│  ✅ Sara (paid)         │
│  ⚠️ Omar (pending)     │
│  🔴 Mohammed (declined) │
│                         │
│  Refund Policy:         │
│  Full refund 48h before │
│  departure.             │
└─────────────────────────┘
```

### 11. User Profile (`/profile`)
```
┌─────────────────────────┐
│  ← Profile          [⚙] │
│  ─────────────────────  │
│                         │
│  ┌───────┐              │
│  │  👤   │  Abdullah    │
│  │Photo  │  +966XX..   │
│  └───────┘              │
│                         │
│  My Car:                │
│  🚗 Toyota Land Cruiser │
│     2022 · White        │
│                         │
│  My Communities (3):    │
│  • LC Club KSA          │
│  • Toyota Offroad       │
│  • Riyadh Cruisers      │
│                         │
│  My Trips (5):          │
│  • Wadi Disi — Oct 5    │
│  • Shafa Farms — Oct 12 │
│                         │
│  ┌───────────────────┐  │
│  │ [Edit Profile]    │  │
│  └───────────────────┘  │
│                         │
│  ─────────────────────  │
│  [🔔 Notifications]     │
│  [🔒 Privacy & Safety]  │
│  [❓ Help & Support]     │
│  [🚪 Sign Out]          │
│                         │
│  [🏠] [🔍] [👤]        │
└─────────────────────────┘
```

### 12. Notification/Privacy Settings (`/settings/notifications`)
```
┌─────────────────────────┐
│  ← Notifications    [✓] │
│  ─────────────────────  │
│                         │
│  Trip Reminders         │
│  [████████░░] On        │
│                         │
│  Chat Messages          │
│  [████████░░] On        │
│                         │
│  Community Updates      │
│  [██████░░░░] Off       │
│                         │
│  Payment Reminders      │
│  [████████░░] On        │
│                         │
│  Departure Alerts       │
│  [████████░░] On        │
│                         │
│  ─────────────────────  │
│  Privacy:               │
│                         │
│  Who can see my trips:  │
│  [Community Members ▼]  │
│                         │
│  Who can see location:  │
│  [Trip Participants ▼]  │
│                         │
│  Auto-expire location:  │
│  [After 4 hours    ▼]   │
│                         │
│  Trusted Contact:       │
│  [+ Add Emergency       │
│      Contact]           │
│                         │
│  ─────────────────────  │
│  ℹ️ Live location and   │
│  in-app assistance      │
│  depend on connectivity │
│  and do not replace     │
│  emergency services.    │
└─────────────────────────┘
```

---

## Navigation Map

```
                    ┌──────────┐
                    │  Splash  │
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
        ┌─────┴─────┐         ┌─────┴─────┐
        │ Onboarding│         │   Auth    │
        │ (first)   │         │           │
        └─────┬─────┘         └─────┬─────┘
              │                     │
              └──────────┬──────────┘
                         │
                   ┌─────┴─────┐
                   │  Main App │
                   │ (Tab Nav) │
                   └─────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────┴────┐     ┌─────┴─────┐    ┌────┴────┐
   │Community│     │   Trip    │    │ Profile │
   │Discovery│     │ Discovery │    │         │
   └────┬────┘     └─────┬─────┘    └────┬────┘
        │                │                │
   ┌────┴────┐     ┌─────┴─────┐    ┌────┴────┐
   │Community│     │   Trip    │    │ Settings│
   │  Home   │     │  Details  │    │ (sub)   │
   └────┬────┘     └─────┬─────┘    └─────────┘
        │                │
   ┌────┴────┐     ┌─────┴─────┐
   │  Chat   │     │  Map View │
   │(Stream) │     │(GoogleMap)│
   └─────────┘     └─────┬─────┘
                         │
                   ┌─────┴─────┐
                   │  Payments │
                   │/Expenses  │
                   └───────────┘
```

---

## Component Library

### Base Components (Atoms)
- `Button` — Primary, Secondary, Ghost, Icon
- `Input` — Text, Phone, Search, Multiline
- `Avatar` — Image, Initials fallback
- `Badge` — Count, Status
- `Card` — Elevated, Outlined
- `Icon` — MaterialCommunityIcons
- `Loading` — Spinner, Skeleton
- `Toast` — Success, Error, Warning

### Composite Components (Molecules)
- `CommunityCard` — Image, name, member count, join button
- `TripCard` — Image, title, date, cost, category badge
- `ParticipantList` — Avatars row
- `ExpenseRow` — Title, amount, status, receipt
- `ChatBubble` — Text, image, pin, reactions
- `LocationPin` — Map marker with status
- `PaymentMethodSelector` — mada, Apple Pay, card

### Screen Sections (Organisms)
- `Header` — Title, back, actions
- `FilterBar` — Categories, distance, rating
- `EmptyState` — Illustration, message, action
- `ErrorState` — Message, retry
- `OfflineBanner` — Connectivity indicator

---

## Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `#1B5E20` (Forest Green) | `#4CAF50` | Brand, actions |
| `--primary-light` | `#4CAF50` | `#81C784` | Accents, success |
| `--accent` | `#FFB300` (Desert Gold) | `#FFD54F` | Highlights, badges |
| `--background` | `#FAFAFA` | `#121212` | Screen bg |
| `--surface` | `#FFFFFF` | `#1E1E1E` | Cards, modals |
| `--text` | `#212121` | `#E0E0E0` | Body text |
| `--text-muted` | `#757575` | `#9E9E9E` | Secondary text |
| `--error` | `#D32F2F` | `#EF5350` | Errors, warnings |
| `--success` | `#388E3C` | `#66BB6A` | Success, paid |
| `--warning` | `#F57C00` | `#FFA726` | Pending, caution |

---

## Typography

| Role | Arabic Font | English Font | Size |
|------|-------------|--------------|------|
| Heading 1 | IBM Plex Sans Arabic Bold | Inter Bold | 28px |
| Heading 2 | IBM Plex Sans Arabic SemiBold | Inter SemiBold | 22px |
| Body | IBM Plex Sans Arabic Regular | Inter Regular | 16px |
| Caption | IBM Plex Sans Arabic Light | Inter Light | 12px |
| Button | IBM Plex Sans Arabic Medium | Inter Medium | 16px |

---

## Approval

| Role | Decision | Date |
|------|----------|------|
| Tech Lead | ✅ Wireframes approved for dev | 2026-09-22 |
| Product Owner | Pending review | — |
