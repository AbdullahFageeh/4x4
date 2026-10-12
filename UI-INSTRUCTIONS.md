# 🛻 Bronco Edition — UI Takeover Instructions

**Read this first (the whole thing takes 5 minutes, but only what you need per task):**

- **One mission at a time.** Finish one mission, check its ✅ list, then move on. Do not skip ahead.
- **Every mission ends with a "DONE = THIS" box.** If you can't tick every box, it's not done — stop and ask.
- **If you get lost:** re-read only the mission's "Why" line. It tells you the *point* of the task.
- **If something breaks:** run `npm run test:ci` and `npx tsc --noEmit`. Both must stay green.
- **Never** delete or rename the theme keys in `src/bronco/theme.ts` — only change their *values*.

---

## The big picture (why we're doing this)

The app works and everything renders. Now we make it **feel like an off-road trip tool** — dark, rugged, calm, with one strong accent color. Right now it looks like a beige generic app. We fix that in 4 missions, in order:

1. Get a working copy of the repo
2. Redesign onboarding (the first thing users see)
3. New theme (grey/black + one accent)
4. Spacing, bottom tabs, and box layouts (the "everything feels crowded" problem)

---

# 📦 MISSION 1 — Clone the repo & reach the Bronco version

**Why:** You need the actual Bronco branch. The default branch is a different app.

## Step 1 — Clone

```bash
git clone https://github.com/AbdullahFageeh/4x4.git
cd 4x4
git checkout feature/ford-bronco
npm install
```

**Check:** `git branch --show-current` prints `feature/ford-bronco`.

## Step 2 — See the Bronco app in the browser

```bash
npm run export:web     # builds the web bundle + auto-repairs it (takes ~1 min)
npx serve dist -l 8091
```

Open **http://localhost:8091**

**Check (the app is the Bronco version if):**
- [ ] The very first screen is a card with 🛻 and the title **"Bronco Edition"** (not a green CarCom screen)
- [ ] You see Arabic text "كروب الفورد برونكو السعودي"
- [ ] A button says "التالي" (Next)

## Step 3 — Get through to the main app (do this once, now)

1. Tap **التالي** (Next)
2. Pick a role — pick **👑 مسؤول منصة** (platform admin) → this unlocks the admin panel later
3. Tap **التالي** again
4. Tap **ابدأ الآن 🚀**
5. On the sign-in screen, type **anything** (e.g. `966500000000` / `test1234`) → it's demo mode
6. Tap **دخول 🛻**

**Check:** You land on a screen with 4 bottom tabs: **الرحلات** (Trips) · **الخرائط** (Maps) · **الدردشة** (Chat) · **حسابي** (My account), plus a red **SOS** button.

## Step 4 — Know your 3 "is it working?" commands

Run these after **every** mission. All three must pass:

```bash
npm run test:ci          # all 37 tests pass
npx tsc --noEmit         # no errors (prints nothing)
npm run export:web       # ends with "Done."
```

> ⚠️ `npm test` (without `:ci`) hangs in watch mode. **Always use `npm run test:ci`.**

✅ **DONE = THIS:**
- [ ] On `feature/ford-bronco`, `npm install` finished
- [ ] `http://localhost:8091` shows the Bronco onboarding card
- [ ] You can reach the 4-tab main screen with the SOS button
- [ ] Your 3 check commands all pass

---

# 🚪 MISSION 2 — Redesign the onboarding

**Why:** Onboarding is the app's first impression. Right now it's a flat beige card with an orange stripe. It should feel like stepping into a desert camp at dusk.

**File to edit:** `src/bronco/screens/BroncoOnboarding.tsx` (all styles are in its `StyleSheet` at the bottom)

## 2.1 — The look (change values in the `styles` object)

| What | Change to |
|---|---|
| `header` background | **Remove the solid orange stripe.** Make it transparent/absent. |
| Whole screen background | Dark charcoal `#17181A` (see Mission 3 — this is why we do the theme *values* there, but for onboarding you can hardcode the dark bg now) |
| Add a "hero" area at top | Full-width image of a Bronco in the desert (sand dunes, dusk light). No image yet? Use a solid gradient `#17181A → #232528` + the 🛻 emoji at 72px as placeholder. |
| The 🛻 | Move it above the title, size **72**, centered. It's the logo for now. |
| Title font | Bold, **28–32px**, white `#F2F3F5`. If you can add a font: use **"Sora"** (Google) for headings, **Inter** for body. (See prompt 2B if using an AI builder.) |
| Body text | 15–16px, `#A7ADB8` (muted grey) |
| Language row | Turn it into a **segmented control** (two pills in one rounded container): `العربية` | `English`. Selected pill = accent color bg, white text. Unselected = transparent, grey text. One tap switches instantly (the logic already exists — `setLanguage`). |
| The big button (`cta`) | Full width, height **52**, radius **12**, background = **accent color** (Mission 3), label bold 16px, dark text `#111`. |
| Add a progress indicator | Three dots or a thin 4px bar under the header. Current step filled with accent, others `#3A3E44`. |

## 2.2 — Step 2 (role selection) — make the cards better

The 4 role cards already exist. Restyle them:

- Card: bg `#232528`, border `#33373D`, radius **14**, padding **16**, gap between cards **12**
- Icon: 32px, in a **44×44 rounded square** (`#2E3136` bg) on the left
- Label: bold 16px white · Description: 13px `#A7ADB8`
- **Selected state (all three):** border = accent color (2px) + a small accent circle with ✓ on the right + card bg shifts to `#26292F`
- Keep the icons: 🚙 🗺️ 🛠️ 👑 (they're fine)

## 2.3 — Motion (small, do last)

- On step change: slide the content **20px horizontally + fade**, **200ms**
- On button press: scale to **0.97** for 100ms (the "press" feel)
- On the final "ابدأ الآن 🚀" button: a very subtle pulsing glow (opacity 0.9↔1, 2s loop) so the eye lands on it

## 2.4 — Copy (real text, both languages)

Keep the existing Arabic/English strings — they're good. Just make sure:
- Step 1 title: **"مرحبًا بك 🙌"** / "Welcome" — no change
- Step 2 title: **"اختر دورك في المجتمع"** / "Pick your role" — no change
- Final screen: keep "جاهز للمغامرة؟"

✅ **DONE = THIS:**
- [ ] Onboarding is dark (charcoal bg, white headings, one accent color only)
- [ ] Progress dots/bar shows the 3 steps
- [ ] Language switch is a segmented control, works in both directions
- [ ] Role cards: icon box, selected = accent border + ✓
- [ ] Step transition animates (slide+fade, 200ms)
- [ ] You can complete onboarding end-to-end in the browser (click through all 3 steps)
- [ ] The 3 check commands pass

---

# 🎨 MISSION 3 — The new theme: "Desert Night" (grey/black + one accent)

**Why:** One theme file controls *every* screen. Change it once → the whole app changes. That's the power move here.

**File to edit:** `src/bronco/theme.ts` — there are exactly 2 objects: `broncoLight` and `broncoDark`.

## 3.1 — The palette (copy these exact values)

### `broncoDark` — this becomes the **default** look

| Key | Value | What it is |
|---|---|---|
| `background` | `#17181A` | App background (near-black with a hint of warm grey) |
| `surface` | `#1E2023` | Headers, tab bar |
| `card` | `#232528` | Cards and boxes |
| `primary` | `#D97B34` | **The ONE accent.** Muted Bronco orange. Used for: main buttons, selected states, active tab, links, progress. |
| `primaryLight` | `#E8945A` | Accent hover/pressed |
| `onPrimary` | `#17181A` | Text ON accent buttons (dark text on orange = high contrast) |
| `text` | `#F2F3F5` | Main text |
| `textMuted` | `#A7ADB8` | Secondary text |
| `border` | `#33373D` | Card borders |
| `divider` | `#2A2D31` | Separator lines |
| `accent` | `#8A94A6` | Cool steel grey — badges, secondary highlights (NOT a second brand color) |
| `success` | `#5FA87E` | Soft green |
| `warning` | `#D9A741` | Amber |
| `error` | `#D95B5B` | Soft red (SOS uses this) |

### `broncoLight` — keep it, make it "daytime desert"

| Key | Value |
|---|---|
| `background` | `#F4F3F1` |
| `surface` | `#FFFFFF` |
| `card` | `#FFFFFF` |
| `primary` | `#C96A28` (slightly deeper orange) |
| `onPrimary` | `#FFFFFF` |
| `text` | `#1C1D1F` |
| `textMuted` | `#6E7278` |
| `border` | `#E4E2DE` |

## 3.2 — Make dark the default

The app picks the theme via `isDark` from `useAppStore()`. Find where `isDark` is initialized (search `src/store/useAppStore.ts` for `isDark`). Set its initial value to `true`.
**Do not remove** the light option — the user can still switch in Settings → Theme.

## 3.3 — Rules (the design "law")

1. **One accent.** `primary` (`#D97B34`) is the only saturated color allowed. Everything else is greys. If you catch yourself wanting a second color — don't.
2. **Text hierarchy, every screen:** heading `#F2F3F5` bold · body `#F2F3F5` regular · secondary `#A7ADB8` · never use pure white `#FFF` and never pure black `#000` for text.
3. **Contrast check:** dark text on accent buttons must be readable. Use `onPrimary` = `#17181A`.
4. **No new colors in screens.** Screens must only reference `theme.colors.*` keys — never hardcode hex in a screen file. (If a screen hardcodes a color today, replace it with the theme key.)

✅ **DONE = THIS:**
- [ ] App opens in dark mode by default
- [ ] The ONLY orange in the whole app is `#D97B34` (and its light variant)
- [ ] Settings → Theme toggle still works (light mode = "daytime desert")
- [ ] No screen file contains a hardcoded hex color (search: `grep -rn "#[0-9A-Fa-f]\{6\}" src/bronco/screens/ src/screens/ App.tsx` should return nothing except theme files)
- [ ] The 3 check commands pass

---

# 📐 MISSION 4 — Spacing, bottom tabs, and box layouts

**Why:** The app works, but it feels *crowded and flat*. This mission fixes rhythm: consistent gaps, a proper tab bar, and boxes that breathe.

**The master spacing scale** (already defined in `src/theme/index.ts` → `spacing` — use these names, not raw numbers):

```
xs = 4 · sm = 8 · md = 16 · lg = 24 · xl = 32
```

**The law of the mission:**
- **Inside** a card: padding **16** (`md`)
- **Between** cards: **12** (this is our one allowed non-scale value — it reads better than 16)
- **Between** sections: **24** (`lg`)
- **Screen side margins:** **16** (`md`)
- **Screen top/bottom padding:** **16**

## 4.1 — The bottom tab bar (file: `App.tsx`, styles `tabBar`, `tabItem`, `tabLabel`)

Current state (the problem): emoji icons, 11px labels, 8px padding — looks like a stub.

Change to:
1. **Icons:** replace the emoji with vector icons from `@expo/vector-icons` — `Ionicons` set (already in Expo). Mapping:
   - الرحلات (Trips) → `compass` / `compass-outline`
   - الخرائط (Maps) → `map` / `map-outline`
   - الدردشة (Chat) → `chatbubbles` / `chatbubbles-outline`
   - حسابي (Profile) → `person` / `person-outline`
   **Active tab = filled icon + accent color. Inactive = outline icon + `textMuted`.**
2. **Sizes:** icon **24**, label **11px** weight 600, gap icon→label **4**
3. **Bar:** height **64** (including safe-area bottom inset), bg `surface`, top border 1px `border`
4. **Active indicator:** a small **3px wide × 3px tall** accent dot or a 20px-wide 3px pill centered *above* the icon. Subtle, not a full underline.
5. **Tap behavior (UX):** switching tabs should **reset the inner scroll position** of that screen to the top (find where each tab screen owns its `ScrollView`/`FlatList` — reset on `onFocus` via a `resetToTop()` call). And: switching tabs should **not** lose the active state (it already doesn't — keep it).

## 4.2 — Cards & boxes (apply across all screens)

Every "box" in the app (trip card, role card, region card, ticket card, etc.) follows **one pattern**:

```
┌─────────────────────────────────┐
│ [icon 44×44 rounded]  Title 16 bold   ← row, gap 12
│              Subtitle 13 muted        │
│                                     │
│  ··· 12px gap ···                    │
│ [meta row: chips or stats, 12px]     │
│                                     │
│ ── divider (only if needed) ──      │
│ [action row: buttons right-aligned]  │
└─────────────────────────────────┘
radius 14 · border 1px `border` · bg `card` · padding 16
```

Rules:
- **One job per card.** A card is either a trip, a region, or a user — never mixed.
- **Meta chips** (like "👥 12/15", "💰 350 ر.س"): 12px text, bg `#2E3136` (dark mode) / `#EFEDEA` (light), radius **8**, padding **4×8**, gap **8**
- **Primary action per card:** max **1** filled button + as many text-buttons as needed, right-aligned (or left in RTL — follow the flow direction)
- **Empty states:** every list needs one. Pattern: centered icon 48px in a `#2E3136` circle + 15px title + 13px muted line + one accent button. (Check each screen: trips, maps regions, chat, tickets — add where missing.)
- **Loading:** replace any blank/white loading screens with a **skeleton** — grey rounded bars (`#2A2D31`) in the card shape, no spinner.

## 4.3 — Screen-by-screen pass (do in this order, one screen per sitting)

| # | Screen (file) | Fix |
|---|---|---|
| 1 | Trips list (`BroncoTripsScreen.tsx`) | Category chips row (🌄 ⛺ 🏜️ 🏙️) → make them horizontal **scrollable** chips (not a 2×2 grid); trip cards → the card pattern above; add a **pull-to-refresh** |
| 2 | Trip detail (`BroncoTripDetailScreen.tsx`) | Group into sections with 24px gaps: [live status banner] → [voice call card] → [info card: destination/meetup/participants/cost as a 2-col spec grid] → [schedule as a vertical timeline: dot + line + time + label] → [checklist] → [ratings]. The schedule timeline is the big win here. |
| 3 | Maps (`OfflineMapsScreen.tsx`) | Region cards: status on the RIGHT (✓ / progress / download btn) — one status per card, never two; live-location section separated by a section title |
| 4 | Chat (`ChatScreen.tsx`) | Message bubbles: mine = accent-tinted bg (`#3A2A1E`) right-aligned, theirs = `card` left-aligned; radius 12 with **4px** on the corner nearest the sender; time 10px muted under the bubble |
| 5 | Profile (`BroncoProfileScreen.tsx`) | Top: avatar circle 64 + name 18 bold + role chip; stats row (5 رحلات · 2 مجتمعات) as 3 equal cells with a big number + small label; car card → the card pattern with a **2-column spec grid** (label muted left, value right); each section = 24px gap |
| 6 | SOS overlay (`SOSOverlay.tsx`) | Full-screen, bg `#17181A` with 95% opacity; reason cards 2×3 grid, radius 12; the confirm button is **full-width, accent, 56px tall** — this is a panic button, it must be impossible to miss |
| 7 | Admin (`AdminPanel.tsx`) | Left sidebar (desktop) / top chips (mobile) for the 8 sections; each section header = 16px bold + a muted count badge (e.g. "1") |

## 4.4 — Navigation between screens (the "moving around" feel)

- **Back arrow** in pushed-screen headers: 44×44 touch target (not just the arrow glyph), `←` or Ionicons `chevron-back` (RTL: `chevron-forward`)
- **Pushed screens** (trip detail, subscriptions, settings…) should slide in from the right with **200ms ease** — if the current nav does a hard swap, add a simple `Animated` translate+fade in `App.tsx`'s `BroncoMainTabs`
- **Header:** pushed screens get a sticky header (bg `surface`, 1px bottom border) with back + centered title; tab screens get the big "🛻 Bronco" header as it is now, but make it sticky

✅ **DONE = THIS:**
- [ ] Tab bar: vector icons (filled when active), accent active state, 64px tall, tap resets scroll
- [ ] Trips screen: scrollable chip row, cards follow the pattern, pull-to-refresh works
- [ ] Trip detail: schedule renders as a vertical timeline
- [ ] Chat: two bubble styles (mine vs theirs), corners point at the sender
- [ ] Profile: 3-cell stats row + 2-col car spec grid
- [ ] SOS: full-screen dark overlay, one giant accent button
- [ ] Every list has an empty state; no white/blank loading screens (skeletons instead)
- [ ] Screen margins are 16 everywhere (eyeball: no screen should look tighter or looser than another)
- [ ] The 3 check commands pass

---

# 🗣️ How to drive an AI builder (Lovable/Replit style)

If you build with an AI tool instead of hand-editing, these are the rules that produce good UI (from Lovable's own prompting docs):

**1. State the style ONCE, then repeat its words in every prompt.**
Save this as your "style sentence" and paste it at the start of each prompt:

> "The app is an off-road trip tool. Style: dark and rugged but calm. Backgrounds in near-black grey (#17181A), cards in #232528, ONE accent color — muted Bronco orange #D97B34 — used only for primary buttons, active tabs, and selection. Text white #F2F3F5, secondary grey #A7ADB8. 14px card radius, 12px gaps between cards, 16px padding inside cards. No gradients, no glass, no extra colors."

**2. Prompt by component, not by page.**
Bad: *"redesign the trips screen"* → Good: *"Redesign only the trip card on the trips screen: icon box on the left, title + date row, meta chips row (participants, cost, rating), and one primary button 'التفاصيل'. Keep the list, keep the chips row, don't touch other screens."*

**3. Always name what must NOT change.**
Append to every change prompt: *"Only change X. Keep the existing colors, layout, and logic. Do not touch anything else."*

**4. Use real content.** The demo data (وادي ديسي, 350 ر.س, 12/15) is real enough — never ask for "lorem ipsum" or "trip 1".

**5. Ask it to ask you.** End big prompts with: *"Ask me any clarifying questions before you build."*

**6. One change per prompt. Screenshot after each.** If it goes wrong, undo that one change — not the whole batch.

**Ready-made prompts for this project (copy → paste):**

**A. Onboarding**
> "Redesign the onboarding screen in `src/bronco/screens/BroncoOnboarding.tsx`. Style: dark and rugged but calm — background #17181A, one accent color #D97B34. Step 1: centered 🛻 at 72px, bold white 30px title 'مرحبًا بك 🙌', 15px grey subtitle, a segmented language control (العربية | English), and a full-width 52px accent button. Add 3-step progress dots under the header. Step 2: four role cards (icon in a 44px rounded square on the left, bold title, grey description, 14px radius, 12px gap) — selected card gets a 2px accent border and a ✓ circle. Step 3: keep the current text, big pulsing accent CTA. Slide+fade 200ms between steps. Only change this one file. Keep all existing logic and i18n."

**B. Theme**
> "Update the color values in `src/bronco/theme.ts` only. Do not rename any keys. Dark theme: background #17181A, surface #1E2023, card #232528, primary #D97B34, onPrimary #17181A, text #F2F3F5, textMuted #A7ADB8, border #33373D, success #5FA87E, warning #D9A741, error #D95B5B. Light theme: background #F4F3F1, card #FFFFFF, primary #C96A28, text #1C1D1F. Also make dark mode the default in `useAppStore` (change the initial value of isDark to true). Do not touch any screen file."

**C. Tab bar**
> "In `App.tsx`, replace the emoji tab icons with Ionicons from @expo/vector-icons: compass, map, chatbubbles, person — outline style when inactive, filled (solid) when active. Active tab color: theme primary. Inactive: theme textMuted. Bar height 64 including safe-area inset, background = surface, 1px top border. Add a 20px-wide 3px accent pill centered above the active icon. Tapping a tab must reset that screen's scroll to the top. Only change the tab bar and its styles. Keep the header and SOS button exactly as they are."

**D. Cards**
> "Restyle all trip cards in `BroncoTripsScreen.tsx` to this pattern: 14px radius, 1px border (#33373D), bg #232528, 16px padding. Row 1: category emoji in a 44px rounded grey square + bold 16px title + 12px grey date. Row 2 (12px gap): meta chips — participants 👥, cost 💰, rating ★ — each chip 12px text, 8px radius, dark grey bg, 4px/8px padding. Row 3: a single text button 'التفاصيل' + a subtle '🗺️ الخريطة' text button, aligned to the start. 12px gap between cards. Make the category filter row a horizontal scrolling chips row instead of a grid. Do not touch the data or the navigation."

---

# 🚦 Mission order — the one-page summary

| Order | Mission | One-line goal | File(s) |
|---|---|---|---|
| 1 | Clone | Be on `feature/ford-bronco` with the app running | terminal |
| 2 | Onboarding | Dark, 3 dots, segmented language, 4 clean role cards | `BroncoOnboarding.tsx` |
| 3 | Theme | Grey/black + one orange, dark by default | `theme.ts` (+ `useAppStore.ts`) |
| 4 | Spacing & UX | 16/12/24 rhythm, real tab bar, consistent cards, empty states | `App.tsx` + 7 screens |

**Rule of thumb: never mix missions.** Theme changes can hide spacing problems; spacing changes can hide theme problems. One at a time.