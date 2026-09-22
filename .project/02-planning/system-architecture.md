# System Architecture

## High-Level Architecture Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP (React Native)                  │
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │   Auth &    │ │  Community  │ │    Trip      │ │    Chat     │ │
│  │   Profile   │ │   Module    │ │   Module     │ │   Module    │ │
│  └──────┬──────┘ └──────┬──────┘ └──────┬───────┘ └──────┬──────┘ │
│         │               │               │                │         │
│  ┌──────┴───────────────┴───────────────┴────────────────┴──────┐ │
│  │                  SHARED CORE LAYER                          │ │
│  │  [State (Zustand) | Network (React Query) | Offline (WDB)]  │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
│                             │                                      │
│  ┌──────────────────────────┴────────────────────────────────────┐ │
│  │                  NATIVE BRIDGE LAYER                          │ │
│  │  [Maps | Location | Notifications | Camera | Payments | FS]  │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────────┐
│                        BACKEND (Supabase)                          │
│                             │                                      │
│  ┌──────────────┐ ┌────────┴────────┐ ┌──────────────────────┐   │
│  │  PostgreSQL  │ │  Realtime API   │ │  Storage (Photos)    │   │
│  │  (Primary DB)│ │  (Presence)     │ │  (Avatars, Receipts) │   │
│  └──────────────┘ └────────┬────────┘ └──────────────────────┘   │
│                             │                                      │
│  ┌──────────────────────────┴────────────────────────────────────┐ │
│  │                  EDGE FUNCTIONS                               │ │
│  │  [Place Search Proxy | Payment Webhooks | Expense Calculator] │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴──────┐   ┌──────────┴──────────┐   ┌─────┴──────┐
│ Google Maps  │   │   Stream Chat       │   │  Moyasar   │
│ Platform     │   │   (Real-time)       │   │  Payments  │
└──────────────┘   └─────────────────────┘   └────────────┘
```

---

## Data Models

### User (Profile)
```typescript
interface User {
  id: UUID;                 // Supabase auth.uid
  name: string;
  avatar_url: string | null;
  phone: string;            // +966XXXXXXXXX
  preferred_language: 'ar' | 'en';
  car_model: string;        // e.g., "Toyota Land Cruiser 2022"
  car_details: {
    year: number;
    color: string;
    modifications: string[];
  } | null;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Community
```typescript
interface Community {
  id: UUID;
  name: string;             // e.g., "LC Club KSA"
  description: string;
  car_model: string;        // The car model this community is for
  cover_image_url: string | null;
  visibility: 'public' | 'private';
  invite_code: string;      // Unique code for invite links
  rules: string;            // Markdown
  member_count: number;     // Denormalized for quick display
  created_by: UUID;         // User ID (organizer)
  created_at: timestamp;
}

interface CommunityMember {
  community_id: UUID;
  user_id: UUID;
  role: 'organizer' | 'member';
  status: 'pending' | 'approved' | 'blocked';
  joined_at: timestamp;
}
```

### Trip
```typescript
interface Trip {
  id: UUID;
  community_id: UUID;
  title: string;
  description: string;
  category: 'scenic' | 'camping' | 'offroad' | 'city_meetup';
  
  // Location
  destination: {
    name: string;
    lat: number;
    lng: number;
    place_id: string | null;  // Google Places ID
  };
  meeting_point: {
    name: string;
    lat: number;
    lng: number;
  };
  route_stops: {
    name: string;
    type: 'fuel' | 'restaurant' | 'campsite' | 'rest_area' | 'other';
    lat: number;
    lng: number;
  }[];
  
  // Schedule
  date: date;
  departure_time: time;
  estimated_return: time | null;
  timezone: string;         // Always 'Asia/Riyadh'
  
  // Capacity & Cost
  participant_limit: number;
  current_participants: number;  // Denormalized
  estimated_cost_rival: number;  // SAR
  cost_currency: 'SAR';
  
  // Status
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  itinerary: string;        // Markdown
  preparation_checklist: string[];
  
  created_by: UUID;
  created_at: timestamp;
  updated_at: timestamp;
}

interface TripParticipant {
  trip_id: UUID;
  user_id: UUID;
  status: 'going' | 'declined' | 'waitlisted';
  joined_at: timestamp;
}
```

### Expense / Payment
```typescript
interface Expense {
  id: UUID;
  trip_id: UUID;
  type: 'trip_fee' | 'food' | 'campsite' | 'supplies' | 'other';
  title: string;
  total_amount: number;     // SAR
  split_type: 'equal' | 'custom';
  receipt_url: string | null;
  created_by: UUID;
  created_at: timestamp;
}

interface ExpenseShare {
  expense_id: UUID;
  user_id: UUID;
  amount: number;           // SAR
  status: 'pending' | 'paid';
  payment_id: string | null;  // Moyasar payment ID
  paid_at: timestamp | null;
}
```

### Chat (Stream)
```typescript
// Stream handles most of this, but we maintain references
interface ChatChannel {
  id: string;               // Stream channel ID
  type: 'community' | 'trip';
  community_id: UUID | null;
  trip_id: UUID | null;
  created_at: timestamp;
}
```

### Live Location
```typescript
interface LocationShare {
  id: UUID;
  user_id: UUID;
  trip_id: UUID;
  viewers: UUID[];          // Who can see this location
  lat: number;
  lng: number;
  accuracy: number;         // meters
  recorded_at: timestamp;   // When location was captured
  expires_at: timestamp;    // When sharing auto-expires
  is_active: boolean;
}
```

---

## Offline Strategy

| Data | Sync Strategy |
|------|---------------|
| User profile | Pull on login, push on edit |
| Community list | Pull on open, cache 24h |
| Trip details | Pull on open, cache locally, sync back on change |
| Expenses | Pull on open, queue local changes |
| Chat | Stream SDK handles offline queue |
| Location | Store locally, flush when online |
| Maps | react-native-maps caches tiles automatically |

---

## Security Considerations

- **Auth:** Supabase Auth with email/password + phone OTP
- **API Keys:** Never hardcoded — use react-native-config (env vars)
- **Row-Level Security:** Enabled on all Supabase tables
- **RLS Policies:**
  - Communities: Public readable, members write
  - Trips: Community members only
  - Expenses: Trip participants only
  - Chat: Channel members only
- **Payment Data:** Never stored in our DB — Moyasar hosts everything
- **Location:** Opt-in only, auto-expire, encrypted at rest

---

## Performance Budget

| Metric | Target |
|--------|--------|
| App launch (cold) | < 3s |
| App launch (warm) | < 1s |
| Screen transition | < 300ms |
| Trip list load | < 2s |
| Chat message send | < 1s |
| Map render | < 2s |
| Payment flow | < 5s |

---

## Approval

| Role | Decision | Date |
|------|----------|------|
| Tech Lead | ✅ Architecture approved for Sprint 1 | 2026-09-22 |
| Product Owner | Pending | — |
