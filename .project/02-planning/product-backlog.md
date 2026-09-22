# Product Backlog

## Sprint Structure

| Sprint | Duration | Focus | Goal |
|--------|----------|-------|------|
| Sprint 0 | 1 week | Foundation | Project setup, infra, auth |
| Sprint 1 | 2 weeks | Communities | CRUD, join, invite, roles |
| Sprint 2 | 2 weeks | Trips | CRUD, categories, participants |
| Sprint 3 | 2 weeks | Maps & Places | Google Maps, directions, POI |
| Sprint 4 | 2 weeks | Payments | Moyasar integration, expenses |
| Sprint 5 | 2 weeks | Chat | Stream integration, channels |
| Sprint 6 | 2 weeks | Location & Polish | Live sharing, offline, sample data |

**Total: ~11 weeks for MVP**

---

## Epic 1: Foundation & Auth (Sprint 0)

### Story 1.1: Project Setup
**As a** developer
**I want** a fully configured React Native project
**So that** I can start building features immediately

**Acceptance Criteria:**
- [ ] React Native 0.73+ with TypeScript configured
- [ ] Navigation (React Navigation 6) set up
- [ ] State management (Zustand) initialized
- [ ] Network layer (React Query) configured
- [ ] i18n (i18next) with Arabic/English
- [ ] Dark/light theme support
- [ ] ESLint + Prettier configured
- [ ] EAS build configuration ready

**Tasks:**
1.1.1 Initialize React Native project with TypeScript template
1.1.2 Set up navigation stack and tab navigator
1.1.3 Configure Zustand store with persistence
1.1.4 Set up React Query with offline support
1.1.5 Configure i18next with Arabic/English translations
1.1.6 Set up theme provider (light/dark)
1.1.7 Configure ESLint, Prettier, Husky pre-commit hooks
1.1.8 Set up EAS build profile (development, preview, production)

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 1.2: Authentication
**As a** user
**I want** to sign up and log in with my phone number
**So that** I can access the app securely

**Acceptance Criteria:**
- [ ] Sign up with phone + password
- [ ] Sign in with phone + password
- [ ] Phone number validation (+966 format)
- [ ] Password strength requirements
- [ ] "Remember me" functionality
- [ ] Sign out
- [ ] Loading states during auth
- [ ] Error handling (invalid creds, network errors)

**Tasks:**
1.2.1 Set up Supabase Auth with phone provider
1.2.2 Create sign-up screen UI
1.2.3 Create sign-in screen UI
1.2.4 Implement phone validation (+966)
1.2.5 Add password strength indicator
1.2.6 Implement "remember me" with secure storage
1.2.7 Add sign-out flow
1.2.8 Add loading/error states
1.2.9 Add Arabic/English translations for auth screens

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 1.3: Onboarding
**As a** new user
**I want** a guided introduction to the app
**So that** I understand what CarCom offers

**Acceptance Criteria:**
- [ ] Onboarding flow with 3-4 slides
- [ ] Skip option available
- [ ] Language selector (Arabic/English)
- [ ] Only shown once (unless reset)
- [ ] Smooth animations between slides

**Tasks:**
1.3.1 Design onboarding slides (illustrations + text)
1.3.2 Implement onboarding screen with pagination
1.3.3 Add language selector
1.3.4 Store onboarding completion in AsyncStorage
1.3.5 Add animations between slides
1.3.6 Add Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 2 days

---

## Epic 2: Communities (Sprint 1)

### Story 2.1: Create Community
**As an** organizer
**I want** to create a car community
**So that** I can gather enthusiasts of the same car model

**Acceptance Criteria:**
- [ ] Form with name, description, car model, cover image
- [ ] Public/private toggle
- [ ] Community rules text field
- [ ] Auto-generate invite code
- [ ] Creator becomes organizer
- [ ] Validation (required fields, unique name)

**Tasks:**
2.1.1 Create community creation screen UI
2.1.2 Implement image upload for cover photo
2.1.3 Add public/private toggle
2.1.4 Implement invite code generation
2.1.5 Form validation
2.1.6 API integration (Supabase)
2.1.7 Auto-assign organizer role to creator
2.1.8 Add Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 2.2: Discover Communities
**As a** user
**I want** to browse and search communities
**So that** I can find groups that match my car

**Acceptance Criteria:**
- [ ] List of communities with search
- [ ] Filter by car model, location
- [ ] Show member count
- [ ] Trending/near me sections
- [ ] Loading skeleton

**Tasks:**
2.2.1 Create community discovery screen
2.2.2 Implement search bar
2.2.3 Add filters (car model, location)
2.2.4 Display community cards
2.2.5 Add trending logic (by member count)
2.2.6 Add "near me" based on user location
2.2.7 Loading skeleton component
2.2.8 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 2.3: Join Community
**As a** user
**I want** to join a community
**So that** I can participate in trips and chat

**Acceptance Criteria:**
- [ ] Join button on community
- [ ] Public communities: instant join
- [ ] Private communities: request to join
- [ ] Invite link support
- [ ] Welcome message after joining

**Tasks:**
2.3.1 Add join button to community cards
2.3.2 Implement join logic (public vs private)
2.3.3 Create invite link deep link handler
2.3.4 Pending approval state for private communities
2.3.5 Welcome notification on join
2.3.6 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 2 days

---

### Story 2.4: Community Home
**As a** member
**I want** to view a community's page
**So that** I see info, trips, and chat access

**Acceptance Criteria:**
- [ ] Community cover, name, description
- [ ] Member count and list
- [ ] Rules display
- [ ] Upcoming trips preview
- [ ] Chat access button
- [ ] Leave community option

**Tasks:**
2.4.1 Create community home screen
2.4.2 Display community info
2.4.3 Member list with avatars
2.4.4 Rules section
2.4.5 Upcoming trips carousel
2.4.6 Chat button linking to community channel
2.4.7 Leave community confirmation
2.4.8 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 2.5: Community Management
**As an** organizer
**I want** to manage members and settings
**So that** I can keep the community safe

**Acceptance Criteria:**
- [ ] View member list with roles
- [ ] Approve/reject pending requests
- [ ] Remove members
- [ ] Block users
- [ ] Report content
- [ ] Edit community settings

**Tasks:**
2.5.1 Create member management screen
2.5.2 Approve/reject pending requests
2.5.3 Remove member action
2.5.4 Block user action
2.5.5 Report content flow
2.5.6 Edit community settings
2.5.7 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 3 days

---

## Epic 3: Trips (Sprint 2)

### Story 3.1: Create Trip
**As an** organizer
**I want** to create a trip
**So that** members can join and plan together

**Acceptance Criteria:**
- [ ] Form with title, description, category
- [ ] Destination search (Google Places)
- [ ] Meeting point selection
- [ ] Date and time picker
- [ ] Participant limit
- [ ] Estimated cost
- [ ] Itinerary text
- [ ] Preparation checklist

**Tasks:**
3.1.1 Create trip creation screen
3.1.2 Google Places autocomplete integration
3.1.3 Meeting point map picker
3.1.4 Date/time picker components
3.1.5 Checklist editor
3.1.6 Form validation
3.1.7 API integration
3.1.8 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 4 days

---

### Story 3.2: Discover Trips
**As a** user
**I want** to browse and filter trips
**So that** I can find interesting outings

**Acceptance Criteria:**
- [ ] List of trips with search
- [ ] Filter by category, date, distance
- [ ] Show participant count and cost
- [ ] Category badges

**Tasks:**
3.2.1 Create trip discovery screen
3.2.2 Search bar
3.2.3 Category filter chips
3.2.4 Date range filter
3.2.5 Trip cards with info
3.2.6 Loading skeleton
3.2.7 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 3.3: Trip Details & Join
**As a** user
**I want** to view trip details and join
**So that** I can confirm my attendance

**Acceptance Criteria:**
- [ ] Full trip info display
- [ ] Organizer info
- [ ] Participant list
- [ ] Join/decline buttons
- [ ] Waitlist if full
- [ ] Cost and payment status

**Tasks:**
3.3.1 Create trip details screen
3.3.2 Display all trip fields
3.3.3 Participant avatars row
3.3.4 Join/decline actions
3.3.5 Waitlist logic
3.3.6 Payment status badge
3.3.7 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 3.4: Trip Management
**As an** organizer
**I want** to update or cancel trips
**So that** I can keep information current

**Acceptance Criteria:**
- [ ] Edit trip fields
- [ ] Cancel trip with reason
- [ ] Notify participants on changes
- [ ] View waitlist

**Tasks:**
3.4.1 Edit trip screen (pre-filled)
3.4.2 Cancel trip with confirmation
3.4.3 Push notification on changes
3.4.4 Waitlist management view
3.4.5 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 2 days

---

## Epic 4: Maps & Places (Sprint 3)

### Story 4.1: Trip Map View
**As a** user
**I want** to see trip route on a map
**So that** I can visualize the journey

**Acceptance Criteria:**
- [ ] Google Maps view with markers
- [ ] Meeting point marker
- [ ] Destination marker
- [ ] Route stops markers
- [ ] Directions button (opens Google Maps app)

**Tasks:**
4.1.1 Integrate react-native-maps
4.1.2 Display meeting point marker
4.1.3 Display destination marker
4.1.4 Display route stops
4.1.5 Polyline for route
4.1.6 "Get Directions" deep link to Google Maps
4.1.7 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 4 days

---

### Story 4.2: Place Search & Suggestions
**As a** user
**I want** to search for destinations
**So that** I can find interesting places

**Acceptance Criteria:**
- [ ] Google Places autocomplete
- [ ] Filter by category (fuel, food, campsites)
- [ ] Show ratings and reviews
- [ ] Verified vs community distinction

**Tasks:**
4.2.1 Integrate Google Places API
4.2.2 Autocomplete search component
4.2.3 Category filters
4.2.4 Display ratings and review count
4.2.5 Verified badge vs community tag
4.2.6 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

## Epic 5: Payments & Expenses (Sprint 4)

### Story 5.1: Trip Payment
**As a** user
**I want** to pay my trip share
**So that** I can confirm attendance

**Acceptance Criteria:**
- [ ] Display amount due
- [ ] Payment method selector (mada, Apple Pay, card)
- [ ] Moyasar hosted checkout
- [ ] Payment confirmation
- [ ] Receipt display

**Tasks:**
5.1.1 Integrate Moyasar SDK
5.1.2 Create payment screen
5.1.3 Payment method selector
5.1.4 Hosted checkout flow
5.1.5 Payment confirmation screen
5.1.6 Receipt display
5.1.7 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 4 days

---

### Story 5.2: Shared Expenses
**As an** organizer
**I want** to record shared expenses
**So that** costs are split fairly

**Acceptance Criteria:**
- [ ] Add expense with title, amount, type
- [ ] Equal or custom split
- [ ] Receipt upload
- [ ] Per-person share calculation
- [ ] Payment status per person

**Tasks:**
5.2.1 Create expense creation screen
5.2.2 Split logic (equal/custom)
5.2.3 Receipt upload
5.2.4 Expense list view
5.2.5 Payment status per participant
5.2.6 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 5.3: Refunds
**As a** user
**I want** refunds for cancelled trips
**So that** I don't lose money unfairly

**Acceptance Criteria:**
- [ ] Refund policy display
- [ ] Automatic refund on organizer cancel
- [ ] Refund status tracking

**Tasks:**
5.3.1 Display refund policy before payment
5.3.2 Moyasar refund API integration
5.3.3 Refund status tracking
5.3.4 Notification on refund
5.3.5 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 2 days

---

## Epic 6: Chat (Sprint 5)

### Story 6.1: Community Chat
**As a** member
**I want** to chat with my community
**So that** we can discuss plans

**Acceptance Criteria:**
- [ ] Real-time messaging
- [ ] Text, photo, location messages
- [ ] Reactions and replies
- [ ] Pinned announcements
- [ ] Mute notifications

**Tasks:**
6.1.1 Integrate Stream Chat SDK
6.1.2 Create community chat channel
6.1.3 Message list UI
6.1.4 Photo attachment
6.1.5 Location pin sharing
6.1.6 Reactions
6.1.7 Reply threads
6.1.8 Pin message feature
6.1.9 Mute toggle
6.1.10 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 5 days

---

### Story 6.2: Trip Chat
**As a** participant
**I want** a dedicated trip chat
**So that** trip-specific discussions happen

**Acceptance Criteria:**
- [ ] Auto-created trip chat
- [ ] Same features as community chat
- [ ] Trip info header

**Tasks:**
6.2.1 Auto-create chat channel on trip creation
6.2.2 Trip info header in chat
6.2.3 Same message features as community chat
6.2.4 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 2 days

---

## Epic 7: Location & Polish (Sprint 6)

### Story 7.1: Live Location Sharing
**As a** user
**I want** to share my live location during trips
**So that** others can find me

**Acceptance Criteria:**
- [ ] Opt-in location sharing
- [ ] Configurable duration
- [ ] Viewer selection
- [ ] Auto-expire
- [ ] Stale detection
- [ ] Battery optimization

**Tasks:**
7.1.1 Background geolocation setup
7.1.2 Share location toggle
7.1.3 Duration selector (1h, 2h, 4h, custom)
7.1.4 Viewer selection
7.1.5 Auto-expire timer
7.1.6 Stale indicator (no update > 15 min)
7.1.7 Location display on map
7.1.8 Battery optimization
7.1.9 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 4 days

---

### Story 7.2: Offline Support
**As a** user in remote areas
**I want** the app to work offline
**So that** I can access trip info without signal

**Acceptance Criteria:**
- [ ] Cached trip details available offline
- [ ] Offline chat queue
- [ ] Reconnection sync
- [ ] Offline banner indicator

**Tasks:**
7.2.1 WatermelonDB setup for offline storage
7.2.2 Sync trips, expenses, profile
7.2.3 Offline chat queue
7.2.4 Sync on reconnect
7.2.5 Offline banner component
7.2.6 Arabic/English translations

**Priority:** P0 (Must Have)
**Estimate:** 3 days

---

### Story 7.3: Notifications
**As a** user
**I want** relevant notifications
**So that** I stay updated on trips and community

**Acceptance Criteria:**
- [ ] Trip reminders
- [ ] Chat mentions
- [ ] Payment reminders
- [ ] Trip changes
- [ ] Departure alerts
- [ ] Notification settings

**Tasks:**
7.3.1 Firebase Cloud Messaging setup
7.3.2 Notification types implementation
7.3.3 Trip reminder scheduling
7.3.4 Payment reminder
7.3.5 Trip change notification
7.3.6 Departure alert
7.3.7 Notification settings screen
7.3.8 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 3 days

---

### Story 7.4: Sample Data & Demo Mode
**As a** new user
**I want** to see realistic Saudi content
**So that** I can explore the app without creating data

**Acceptance Criteria:**
- [ ] Realistic Saudi communities (LC Club KSA, etc.)
- [ ] Sample trips with Saudi destinations
- [ ] Demo places with Google Maps links
- [ ] Clearly labeled as demo data

**Tasks:**
7.4.1 Create seed data script
7.4.2 Saudi communities (5-10)
7.4.3 Saudi destinations (Wadi Disi, Shafa Farms, etc.)
7.4.4 Sample trips with realistic dates
7.4.5 Demo data label/tag
7.4.6 Arabic/English translations

**Priority:** P1 (Should Have)
**Estimate:** 2 days

---

## Story Priority Summary

### P0 (Must Have) - MVP
- 1.1 Project Setup
- 1.2 Authentication
- 1.3 Onboarding
- 2.1 Create Community
- 2.2 Discover Communities
- 2.3 Join Community
- 2.4 Community Home
- 3.1 Create Trip
- 3.2 Discover Trips
- 3.3 Trip Details & Join
- 4.1 Trip Map View
- 4.2 Place Search & Suggestions
- 5.1 Trip Payment
- 5.2 Shared Expenses
- 6.1 Community Chat
- 6.2 Trip Chat
- 7.2 Offline Support

### P1 (Should Have) - Can defer if needed
- 2.5 Community Management
- 3.4 Trip Management
- 5.3 Refunds
- 7.1 Live Location Sharing
- 7.3 Notifications
- 7.4 Sample Data & Demo Mode

---

## Definition of Done (DoD)

A story is "Done" when:
- [ ] Code implemented and self-reviewed
- [ ] Unit tests written and passing (>80% coverage for critical paths)
- [ ] Manual testing on both iOS and Android
- [ ] Arabic (RTL) and English tested
- [ ] Loading, empty, error, and offline states handled
- [ ] Code reviewed (if team > 1)
- [ ] Documentation updated
- [ ] Acceptance criteria met
- [ ] Merged to main branch
