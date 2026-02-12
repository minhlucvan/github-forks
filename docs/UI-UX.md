# UI/UX Design

> This document is driven by [USER-RESEARCH.md](./USER-RESEARCH.md) and [FEATURES.md](./FEATURES.md).
> Every layout decision maps to a user segment. Every component earns its pixels.

---

## 1. The 3-Second Promise

Users arrive frustrated — they've already tried GitHub's fork tab and failed. Our job:

```
Second 0:   Page loads. Search bar is focused. Nothing else competes for attention.
Second 1:   User pastes a GitHub URL. We auto-detect, parse, and start fetching.
Second 2:   Parent repo card appears. Progress bar shows fork pages loading.
Second 3:   First forks render. Sorted by relevance. The best fork is row #1.
```

Everything in the UI exists to protect this promise. If a component slows it down, it ships later or loads lazily.

---

## 2. Design Principles (from User Research)

| Principle | User insight it serves | UI rule |
|-----------|----------------------|---------|
| **Instant value** | Refugees need an answer NOW; they arrived from a frustrating GitHub search | Search bar auto-focused on load. Paste-to-results in one action. No tutorials, no sign-up |
| **Relevance is visual** | "Active" ≠ recently pushed; users want meaningful divergence | Ahead/behind badges are the most prominent data in each row — bigger than stars, bolder than dates |
| **Progressive depth** | Refugees scan; Evaluators compare; Mappers explore | Layer 1: table + sort. Layer 2: filters + sparklines. Layer 3: fork tree + export |
| **Rate limits are a UX problem, not a technical one** | Users hit 403 errors and don't understand why | Show remaining requests always. Escalate visibility as limit approaches. Token input appears contextually, not in settings |
| **Every screen is shareable** | Users paste our links in GitHub issue threads of abandoned repos | URL reflects full state. Copy-link button is always one click away. OG meta tags render rich previews |
| **Calm confidence** | The original tool's dark mode "looks so ugly" (Issue #79); competitors feel cluttered | Restrained color palette. Whitespace is a feature. Color only where it carries meaning |

---

## 3. User Journeys → Screen States

### Journey A: The Refugee (largest segment)

> "My project depends on X. X is dead. Which fork do I switch to?"

```
STATE 1: Landing                STATE 2: Loading              STATE 3: Results
┌─────────────────────┐        ┌─────────────────────┐       ┌─────────────────────┐
│                     │        │  ▓▓▓▓▓░░░ 3/8 pages │       │  facebook/react     │
│  [Search bar]       │  ──►   │                     │  ──►  │  ⭐220k  🔱45k      │
│  focused, waiting   │  paste │  ░░░░░░░░░░░░░░░░░ │  done │                     │
│                     │        │  ░░░░░░░░░░░░░░░░░ │       │  user-a  ↑24  82 🟢 │
│  Try: react, vue…   │        │  ░░░░░░░░░░░░░░░░░ │       │  user-b  ↑89  76 🟢 │
│                     │        │  skeleton rows...   │       │  user-c  ↑3   41 🟡 │
└─────────────────────┘        └─────────────────────┘       └─────────────────────┘
                                                                       ▲
                                                              Refugee sees the winner
                                                              in row #1. Done.
```

**What the Refugee needs to see immediately:** Health score badge + ahead count. That's the answer.
**What they don't need yet:** Sparklines, filter panel, export, fork tree. Hide these.

### Journey B: The Evaluator

> "There are 15 active forks. Which one has the real work?"

```
STATE 3: Results (same)         STATE 4: Filtered              STATE 5: Deep compare
┌─────────────────────┐        ┌─────────────────────┐       ┌─────────────────────┐
│  Showing 2,847 forks│        │  Showing 47 forks   │       │  user-a/react       │
│  [▼ Filters]        │  ──►   │  [✕ ahead>0, <1yr]  │  ──►  │  ↑24 ahead ↓2 behind│
│                     │  click │                     │  click │  ▁▃▅▇█▅▃▁ activity  │
│  user-a ↑24 ░░░    │        │  user-a ↑24 ▁▃▅▇█ │       │  Last push: 2 days  │
│  user-b ↑89 ░░░    │        │  user-b ↑89 ▅▇█▅▃ │       │  Stars: 45          │
│  user-c ↑3  ░░░    │        │  user-d ↑12 ▁▁▃▅▇ │       │  "React with SSR..." │
└─────────────────────┘        └─────────────────────┘       └─────────────────────┘
         ▲                              ▲                              ▲
  Evaluator opens filters       Narrows to meaningful          Expands a row for
  to cut through noise          forks only                     full detail
```

**What the Evaluator needs:** Filters + ahead/behind as sortable column + sparklines loading in.
**Progressive reveal:** Filters collapsed by default → open on click → quick-filter presets at top.

### Journey C: The Mapper

> "The real successor might be a fork-of-a-fork."

```
STATE 3: Results                STATE 6: Tree expanded
┌─────────────────────┐        ┌──────────────────────────┐
│  user-a  ↑24  ▶ 12  │  ──►   │  user-a          ↑24     │
│  user-b  ↑89  ▶ 3   │  click │  ├─ user-x       ↑48  ←! │  ← hidden gem
│  user-c  ↑3   ▶ 0   │        │  ├─ user-y       ↑2      │
│                      │        │  └─ user-z       ↑31     │
│                      │        │  user-b          ↑89     │
│                      │        │  ├─ user-w       ↑95  ←! │
└──────────────────────┘        └──────────────────────────┘
         ▲                                  ▲
  ▶ indicator shows                 Indented sub-forks reveal
  this fork has sub-forks           the real leaders
```

**What the Mapper needs:** Fork-count indicator on each row + expand/collapse + indentation.
**Key insight:** The most valuable fork (user-x at ↑48) was invisible in the flat list.

### Journey D: Rate Limit Crisis

> "I got a 403. What happened? How do I fix it?"

```
STATE: Healthy                  STATE: Warning                 STATE: Blocked
┌─────────────────────┐        ┌─────────────────────┐       ┌─────────────────────┐
│  52/60 remaining    │  ──►   │  ⚠ 8/60 remaining   │  ──►  │  ✕ Rate limit hit   │
│  (subtle, in header)│  usage │  Add token for more →│  zero │  Resets in 47 min   │
│                     │        │  (yellow, prominent) │       │  ┌─────────────────┐ │
│                     │        │                     │       │  │ Paste token here │ │
│                     │        │                     │       │  │ [Save]  [Cancel] │ │
│                     │        │                     │       │  └─────────────────┘ │
└─────────────────────┘        └─────────────────────┘       └─────────────────────┘
                                                              Auto-expanded. No hunting.
```

**The UX insight:** Don't hide the token input in "Settings." Surface it exactly when the user needs it, with escalating urgency.

---

## 4. Page Layout

### 4.1 Desktop (>= 1024px)

```
┌────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Active Forks                    52/60 remaining  [◐] [GitHub]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  SEARCH                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  🔍  Paste a GitHub URL or type owner/repo              [Find]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  PARENT CARD                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  facebook/react                                     [GitHub →]  │  │
│  │  A declarative, efficient, and flexible JS library for UIs      │  │
│  │  ⭐ 220k   🔱 45k   📋 1.2k issues   📄 MIT   ● JavaScript     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  TOOLBAR                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  2,847 forks   [Meaningful ✕] [Active ✕]  [▼ Filters]          │  │
│  │                                           [↓ Export] [Cols ▼]   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  TABLE                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Score│ Owner       │ Ahead/Behind     │ ⭐  │ Push  │ Activity  │  │
│  │──────┼─────────────┼──────────────────┼─────┼───────┼───────────│  │
│  │ 82 🟢│ ○ user-a    │ ↑24 ahead ↓2     │ 45  │ 2d    │ ▁▃▅▇█▅▃  │  │
│  │ 76 🟢│ ○ user-b    │ ↑89 ahead ↓56    │ 120 │ 1w    │ ▅▇█▇▅▃▁  │  │
│  │ 41 🟡│ ○ user-c    │ ↑3 ahead  ↓0     │ 8   │ 3mo   │ ▁▁▁▁▃▅▁  │  │
│  │ 12 🟠│ ○ user-d    │ · identical      │ 2   │ 1yr   │ ▁▁▁▁▁▁▁  │  │
│  │ ░░░░ │ ░░░░░░░░░░ │ ░░░░░░░░░░░░░░░ │ ░░  │ ░░░░  │ ░░░░░░░  │  │
│  │──────┴─────────────┴──────────────────┴─────┴───────┴───────────│  │
│  │  ◀  1  2  3  ...  57  ▶                   25 │ 50 │ 100 / page │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  FOOTER                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Open source · GitHub · MIT License · Bookmarklet: drag here →  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

**Key layout decisions:**
- **Score is the first column.** Refugees scan left-to-right; the answer should be column 1.
- **Ahead/Behind is column 3** — the core differentiator, visually prominent.
- **Activity sparkline is the last column** — visual context, not primary data.
- **Toolbar has quick-filter chips** at the top level, not buried in a panel.
- **Rate limit is always visible** in the header — not hidden until it's too late.

### 4.2 Tablet (768px - 1023px)

```
┌────────────────────────────────────────────────┐
│  Active Forks          52/60  [◐] [GitHub]     │
├────────────────────────────────────────────────┤
│  🔍  Paste URL or owner/repo          [Find]  │
├────────────────────────────────────────────────┤
│  facebook/react  ⭐220k  🔱45k  📋1.2k  MIT   │
├────────────────────────────────────────────────┤
│  2,847 forks  [Meaningful ✕]  [▼ More]         │
├────────────────────────────────────────────────┤
│  Score│ Owner     │ Ahead/Behind  │ ⭐ │ Push  │ ← horizontal scroll
│──────┼───────────┼───────────────┼────┼───────│    for more columns
│ 82 🟢│ ○ user-a  │ ↑24  ↓2      │ 45 │ 2d    │
│ 76 🟢│ ○ user-b  │ ↑89  ↓56     │ 120│ 1w    │
│ 41 🟡│ ○ user-c  │ ↑3   ↓0      │ 8  │ 3mo   │
├────────────────────────────────────────────────┤
│  ◀ 1 2 3 ... 57 ▶               25/50/100     │
└────────────────────────────────────────────────┘
```

- Parent card compresses to one-line summary
- Table drops Activity and Size columns (available via column toggle)
- First column (Score) and second column (Owner) are sticky on horizontal scroll
- Filter panel becomes a slide-over sheet

### 4.3 Mobile (< 768px)

**Table becomes cards.** Tables don't work on 375px screens. Each fork becomes a card:

```
┌────────────────────────────────────┐
│  Active Forks       8/60  [◐]     │
├────────────────────────────────────┤
│  🔍  Paste URL…              [Go] │
├────────────────────────────────────┤
│  facebook/react                    │
│  ⭐220k  🔱45k  📋1.2k            │
├────────────────────────────────────┤
│  2,847 forks  [▼ Filter]          │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  82 🟢  ○ user-a/react      │  │
│  │  ↑24 ahead  ↓2 behind       │  │
│  │  ⭐ 45  Push: 2 days ago    │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  76 🟢  ○ user-b/react      │  │
│  │  ↑89 ahead  ↓56 behind      │  │
│  │  ⭐ 120  Push: 1 week ago   │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  41 🟡  ○ user-c/react      │  │
│  │  ↑3 ahead  · even           │  │
│  │  ⭐ 8  Push: 3 months ago   │  │
│  └──────────────────────────────┘  │
│                                    │
│  [Load more]                       │
└────────────────────────────────────┘
```

- Card layout: Score badge (top-left), owner (top-right), ahead/behind (middle), meta (bottom)
- Filters open as a bottom sheet
- Pagination becomes "Load more" infinite scroll
- Tap card → open fork on GitHub. Long-press → expand detail.

---

## 5. Component Design

### 5.1 Search Bar

**The most important component.** It's the first thing users see and the only interaction before value delivery.

```
RESTING (page load — auto-focused):
┌──────────────────────────────────────────────────────────────┐
│  🔍  Paste a GitHub URL or type owner/repo           [Find] │
└──────────────────────────────────────────────────────────────┘

FOCUSED WITH HISTORY:
┌──────────────────────────────────────────────────────────────┐
│  🔍  |                                               [Find] │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Recent                                                │  │
│  │  facebook/react                            ⭐ 220k     │  │
│  │  torvalds/linux                            ⭐ 170k     │  │
│  │  techgaun/active-forks                     ⭐ 2.4k     │  │
│  │  ──────────────────────────────────────────────────── │  │
│  │  Clear history                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

LOADING:
┌──────────────────────────────────────────────────────────────┐
│  🔍  facebook/react                                  [····] │
│       Fetching forks...  ▓▓▓▓▓▓░░░░  600/2,400              │
└──────────────────────────────────────────────────────────────┘

ERROR:
┌──────────────────────────────────────────────────────────────┐
│  🔍  facbook/react                                   [Find] │
│       ⚠ Not found. Did you mean facebook/react?  [Try it]   │
└──────────────────────────────────────────────────────────────┘
```

**Behaviors:**
- Auto-focused on page load (the page exists to search)
- Paste detection: if clipboard content matches `github.com/...`, auto-parse and submit
- Enter key submits
- Inline progress bar during multi-page fetch (not a separate loading screen)
- Error messages are inline, actionable, and suggest corrections
- History dropdown on focus — keyboard navigable (↑↓ + Enter)

### 5.2 Parent Repository Card

**Purpose:** Establish the baseline. Users need to see what they're comparing forks *against*.

```
┌──────────────────────────────────────────────────────────────────┐
│  ● JavaScript                                                    │
│  facebook/react                                      [GitHub →] │
│  A declarative, efficient, and flexible JavaScript library       │
│  for building user interfaces                                    │
│                                                                  │
│  ⭐ 220,342    🔱 45,102    📋 1,247 open    📄 MIT              │
│  Last push: 2 days ago    Created: May 2013                      │
│  javascript · react · frontend · ui · library                    │
└──────────────────────────────────────────────────────────────────┘
```

- Language dot uses GitHub's language color (JavaScript = #f1e05a)
- Metrics use `Intl.NumberFormat` for locale-aware formatting
- Last push uses relative time (`Intl.RelativeTimeFormat`)
- Topics rendered as subtle pill badges
- Links to GitHub repo (external link icon)
- Collapses to one-line on mobile: `facebook/react  ⭐220k  🔱45k`

### 5.3 Toolbar

**Purpose:** Provide quick actions without overwhelming. Progressive disclosure starts here.

```
COMPACT (default):
┌──────────────────────────────────────────────────────────────────┐
│  2,847 forks    [Meaningful] [Active] [All]    [▼ Filters]      │
│                                                [↓ Export] [≡]   │
└──────────────────────────────────────────────────────────────────┘

FILTERS EXPANDED:
┌──────────────────────────────────────────────────────────────────┐
│  Showing 47 of 2,847 forks                        [Clear all ✕] │
│  ──────────────────────────────────────────────────────────────  │
│  Stars ≥  [__10__]      Last push: within [▼ 1 year     ]       │
│  Ahead ≥  [__1___]      Behind ≤  [▼ Any        ]               │
│  Health ≥ [────●────────────] 25     [☑] Has issues enabled      │
└──────────────────────────────────────────────────────────────────┘
```

**Quick-filter chips** (always visible, one-click):
- **Meaningful** = ahead > 0, pushed within 1 year, stars > 0
- **Active** = pushed within 6 months
- **All** = remove all filters (default)

Chips are toggle-style: click to activate (highlighted), click again to deactivate. Active chip shows result count.

**Why quick filters matter:** The Evaluator's #1 job is "show me only forks with meaningful changes." One click should do that — not opening a panel, setting 3 fields, and clicking apply.

### 5.4 Fork Table Row

**Purpose:** Each row answers "Should I look at this fork?" The answer should be scannable in <1 second per row.

```
FULL ROW (desktop):
┌──────┬──────────────┬───────────────────┬──────┬───────┬───────────┐
│ 82 🟢│ ○ user-a     │ ↑ 24 ahead        │ ⭐ 45│ 2d ago│ ▁▃▅▇█▅▃  │
│      │   /react     │ ↓ 2 behind        │      │       │           │
└──────┴──────────────┴───────────────────┴──────┴───────┴───────────┘

ROW WITH SUB-FORKS INDICATOR:
┌──────┬──────────────┬───────────────────┬──────┬───────┬─────┬─────┐
│ 76 🟢│ ○ user-b     │ ↑ 89 ahead        │ ⭐120│ 1w ago│ ▅▇█ │ ▶ 3 │
│      │   /react     │ ↓ 56 behind       │      │       │     │     │
└──────┴──────────────┴───────────────────┴──────┴───────┴─────┴─────┘
                                                                 ▲
                                                          "3 sub-forks"
                                                          click to expand

EXPANDED ROW (click to reveal):
┌──────────────────────────────────────────────────────────────────────┐
│ 76 🟢│ ○ user-b/react                                    [GitHub →] │
│      │ ↑ 89 ahead  ↓ 56 behind                                     │
│      │ "A React fork with server-side rendering built in"           │
│      │ ⭐ 120  🔱 15  📋 8 issues  📄 MIT                           │
│      │ Default branch: main   Size: 42.5 MB   Created: Jan 2024    │
│      │ ▁▁▃▅▇█▇█▅▇█▇▅▃▁▁▃▅▇█▇▅▃▁▁▁▃▅▇█▇█▅▇█▇▅▃▁▁▃▅▇█▅▃▁▁▁▃▅▇█ │
│      │ └──────────── 52-week commit activity ──────────────────────┘ │
├──────┴──────────────────────────────────────────────────────────────┤
│  ├─ user-x/react          ↑ 48 ahead  ↓ 56 behind   ⭐ 8   3d ago │
│  ├─ user-y/react          ↑ 2 ahead   ↓ 56 behind   ⭐ 0   6mo    │
│  └─ user-z/react          ↑ 31 ahead  ↓ 60 behind   ⭐ 2   2w ago │
└──────────────────────────────────────────────────────────────────────┘
```

**Information hierarchy within a row (left to right):**
1. **Health score** — the quick answer (colored badge, scannable)
2. **Owner + avatar** — identity (who maintains this?)
3. **Ahead/behind** — the core signal (did they do real work?)
4. **Stars** — social proof
5. **Last push** — recency (secondary signal)
6. **Activity sparkline** — visual pattern (tertiary signal)

This order matches the Refugee's scanning pattern: "Is it good? Who is it? What did they do?"

### 5.5 Ahead/Behind Badge

**The most important data component.** This is what the entire rebuild exists to show.

```
ACTIVE DIVERGENCE (the good one):
┌─────────────────────────────┐
│  ↑ 24 ahead   ↓ 2 behind   │      green pill    orange pill
└─────────────────────────────┘

AHEAD AND CURRENT:
┌─────────────────────────────┐
│  ↑ 89 ahead   · even       │      green pill    gray text
└─────────────────────────────┘

STALE CLONE (no independent work):
┌─────────────────────────────┐
│  · even    ↓ 142 behind     │      gray text     red pill
└─────────────────────────────┘

IDENTICAL:
┌─────────────────────────────┐
│  · identical                │      muted gray pill
└─────────────────────────────┘

LOADING:
┌─────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░ │      shimmer animation
└─────────────────────────────┘

UNAVAILABLE (rate limited):
┌─────────────────────────────┐
│  — data unavailable         │      muted text, tooltip explains
└─────────────────────────────┘
```

**Visual weight rules:**
- `ahead > 0` is ALWAYS green — this is the "real work" signal
- `behind` count uses warm colors (orange/red) to indicate drift
- `identical` and `even` are purposely de-emphasized — these forks are uninteresting
- The `ahead` number is bold; the `behind` number is regular weight
- Clicking the badge could link to GitHub's compare view (future)

### 5.6 Health Score Badge

**Purpose:** One-glance answer for the Refugee. "Is this fork worth looking at?"

```
THRIVING:   92  ●●●●●●●●●○  blue badge, white text
ACTIVE:     68  ●●●●●●●○○○  green badge, white text
MODERATE:   41  ●●●●○○○○○○  yellow badge, dark text
LOW:        18  ●●○○○○○○○○  orange badge, white text
INACTIVE:    5  ●○○○○○○○○○  gray badge, white text
LOADING:    ░░  ░░░░░░░░░░  skeleton shimmer (partial score shown)
```

- Displayed as a number + small dot bar in table
- Color-coded to allow scanning an entire column quickly
- Tooltip on hover explains the formula: "Based on: 24 commits ahead (40%), 45 stars (25%), pushed 2 days ago (20%), ..."
- Partial score shown while ahead/behind data is still loading (marked with a ~ prefix)

### 5.7 Activity Sparkline

**Purpose:** Visual pattern recognition. "Sustained effort or one-time dump?"

```
SUSTAINED ACTIVITY:      ▂▃▅▇█▇▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃▅▇█▇▅▃
RECENT BURST:            ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▃▅▇█▇▅▃
ONE-TIME DUMP:           ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
NO ACTIVITY:             ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
```

- 52 data points (one per week), 120px x 24px inline SVG
- Hover/tap: tooltip with "Week of Jan 6: 14 commits"
- Color: matches row's health score color (subtle, not distracting)
- Lazy loaded — only fetches when row scrolls into view
- Fetched AFTER ahead/behind data (lower priority, higher API cost)

### 5.8 Rate Limit Indicator

**Purpose:** Prevent surprise 403 errors by making limits visible *before* they hit.

```
STATE 1 — HEALTHY (header, subtle):
┌────────────────────────┐
│  52/60 remaining       │   muted text, small
└────────────────────────┘

STATE 2 — WARNING (header, yellow):
┌────────────────────────────────────────────┐
│  ⚠ 8/60 remaining  —  Add token for more →│   yellow bg, link to expand
└────────────────────────────────────────────┘

STATE 3 — CRITICAL (inline banner, red):
┌──────────────────────────────────────────────────────────────┐
│  ✕  API rate limit exceeded. Resets in 47 minutes.           │
│                                                              │
│  Add a GitHub token to continue now:                         │
│  ┌────────────────────────────────────────────────────┐      │
│  │  ghp_  ••••••••••••••••••••••                      │      │
│  └────────────────────────────────────────────────────┘      │
│  [Save token]   Needs public_repo scope (read-only)          │
│  Create one → github.com/settings/tokens                     │
└──────────────────────────────────────────────────────────────┘

STATE 4 — AUTHENTICATED (header, green):
┌──────────────────────────────────────────────────┐
│  ✓ 4,892/5,000 remaining                [Clear] │   green text
└──────────────────────────────────────────────────┘
```

**Escalation logic:**
- `> 20 remaining`: Small text in header
- `≤ 20 remaining`: Yellow background, "Add token" link
- `≤ 5 remaining`: Amber pulse animation
- `= 0`: Full inline banner with token input auto-expanded
- Token saved: Green check, count updates in real-time

### 5.9 Filter Panel

**Purpose:** Help the Evaluator go from 2,000 forks to 10 candidates.

```
COLLAPSED (default — just quick-filter chips):
┌──────────────────────────────────────────────────────────────┐
│  2,847 forks   [Meaningful] [Active] [All]   [▼ More filters]│
└──────────────────────────────────────────────────────────────┘

EXPANDED:
┌──────────────────────────────────────────────────────────────┐
│  Showing 47 of 2,847                          [Clear all ✕] │
│  ────────────────────────────────────────────────────────── │
│                                                              │
│  Stars         ≥  [____10____]                               │
│  Last pushed   within [▼ 1 year       ]                      │
│  Ahead         ≥  [____1_____]                               │
│  Behind        ≤  [▼ Any             ]                       │
│  Health score  ≥  [──────●───────────] 25                    │
│  [☑] Has issues enabled                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Quick-filter chips behavior:**
- `Meaningful` = ahead > 0 AND pushed within 1 year AND stars > 0
- `Active` = pushed within 6 months
- `All` = clear all filters
- Active chip gets a highlight color + count badge: `[Meaningful · 47]`
- Chips are mutually exclusive with each other, but combinable with manual filters

**Why this matters:** Issue #52 showed users frustrated that the default view doesn't filter noise. Quick filters give a one-click answer.

### 5.10 Export Menu

```
┌────────────────────────────────┐
│  ↓ Export ▾                    │
│  ┌──────────────────────────┐  │
│  │  ↓ Export as CSV          │  │
│  │  ↓ Export as JSON         │  │
│  │  ─────────────────────── │  │
│  │  🔗 Copy shareable link   │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

- Exports current filtered/sorted view only
- CSV includes: owner, repo, ahead, behind, stars, forks, issues, last push, health score
- JSON includes full API data for filtered results
- "Copy link" shares current URL state (sort + filter + page)
- Filename: `forks-facebook-react-2026-02-12.csv`

---

## 6. Visual Design System

### 6.1 Color Palette

Colors carry semantic meaning. We use color sparingly — only where it communicates data.

**Light theme** (default):

| Token | Value | Semantic meaning |
|-------|-------|-----------------|
| `bg-page` | `#ffffff` | Page canvas |
| `bg-card` | `#f9fafb` | Elevated surfaces (parent card, filter panel) |
| `bg-row-alt` | `#f9fafb` | Alternating table rows |
| `bg-row-hover` | `#f3f4f6` | Hovered row |
| `text-primary` | `#111827` | Body text, fork names, numbers |
| `text-secondary` | `#6b7280` | Supporting text, captions, "last push" |
| `text-muted` | `#9ca3af` | Placeholder text, disabled state |
| `border` | `#e5e7eb` | Table lines, card borders, dividers |
| `accent` | `#2563eb` | Links, primary button, interactive elements |
| `accent-hover` | `#1d4ed8` | Hover state for accent |
| `ahead` | `#059669` | Ahead commit count, "active" health, positive signals |
| `behind` | `#d97706` | Behind commit count, "moderate" health, drift warning |
| `danger` | `#dc2626` | Errors, "inactive" health, rate limit critical |
| `score-thriving` | `#2563eb` | Health 80-100 |
| `score-active` | `#059669` | Health 60-79 |
| `score-moderate` | `#d97706` | Health 40-59 |
| `score-low` | `#ea580c` | Health 20-39 |
| `score-inactive` | `#9ca3af` | Health 0-19 |

**Dark theme** (GitHub-inspired):

| Token | Value | Semantic meaning |
|-------|-------|-----------------|
| `bg-page` | `#0d1117` | Page canvas |
| `bg-card` | `#161b22` | Elevated surfaces |
| `bg-row-alt` | `#161b22` | Alternating table rows |
| `bg-row-hover` | `#1c2128` | Hovered row |
| `text-primary` | `#f0f6fc` | Body text |
| `text-secondary` | `#8b949e` | Supporting text |
| `text-muted` | `#484f58` | Placeholder, disabled |
| `border` | `#30363d` | Borders, dividers |
| `accent` | `#58a6ff` | Links, interactive |
| `accent-hover` | `#79c0ff` | Hover state |
| `ahead` | `#3fb950` | Ahead commits |
| `behind` | `#d29922` | Behind commits |
| `danger` | `#f85149` | Errors, critical |
| `score-thriving` | `#58a6ff` | Health 80-100 |
| `score-active` | `#3fb950` | Health 60-79 |
| `score-moderate` | `#d29922` | Health 40-59 |
| `score-low` | `#f0883e` | Health 20-39 |
| `score-inactive` | `#484f58` | Health 0-19 |

**Why GitHub's dark palette:** Our users live on GitHub. Matching their dark-mode expectations reduces cognitive friction.

### 6.2 Typography

| Element | Size | Weight | Font | Why |
|---------|------|--------|------|-----|
| Page title | 20px / 1.25rem | 600 | Sans | Not a hero banner — it's a tool, not a landing page |
| Parent repo name | 18px / 1.125rem | 600 | Sans | The "subject" of the page |
| Table header | 12px / 0.75rem | 600 | Sans, uppercase tracking | Compact column labels, scannable |
| Table body text | 14px / 0.875rem | 400 | Sans | Fork names, descriptions |
| Table numbers | 14px / 0.875rem | 500 | Mono | Stars, ahead/behind, scores — monospace for alignment |
| Health score | 14px / 0.875rem | 700 | Mono | Bold for quick scanning |
| Relative time | 13px / 0.8125rem | 400 | Sans | "2 days ago" — smaller, secondary info |
| Caption / help text | 12px / 0.75rem | 400 | Sans | Filter labels, rate limit text |

**Font stacks:**
- Sans: `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`
- Mono: `JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace`

**Why Inter:** Open source, designed for screens, excellent numeric readability, variable font for performance.

**Why monospace for numbers:** Ahead/behind counts, star counts, and scores must align vertically in the table. Proportional fonts cause jagged columns.

### 6.3 Spacing Scale

Based on 4px grid (Tailwind defaults):

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inside pills, between icon and label |
| `space-2` | 8px | Between related items in a row |
| `space-3` | 12px | Table cell padding, input padding |
| `space-4` | 16px | Between sections within a card |
| `space-6` | 24px | Between major sections (search → card → table) |
| `space-8` | 32px | Page margins (desktop) |
| `space-4` | 16px | Page margins (mobile) |

### 6.4 Border Radius

| Element | Radius |
|---------|--------|
| Cards, filter panel | 8px |
| Buttons, inputs | 6px |
| Pill badges (health, ahead/behind) | 9999px (full) |
| Avatars | 9999px (circle) |
| Table | 8px (outer only) |

---

## 7. Loading States — The Choreography

Loading is not a single state — it's a **sequence of progressive reveals** that keep the user engaged.

### Stage 1: Search submitted (0-500ms)
```
Search bar shows inline spinner. Button text changes to "Finding..."
Nothing else changes yet. This is fast enough that skeleton rows would flash.
```

### Stage 2: Parent repo loaded (500ms-1s)
```
Parent card fades in with repo metadata.
Fork count appears: "Fetching 2,847 forks..."
Progress bar begins: ▓░░░░░░░░░ 1/29 pages
Table area shows 5-8 skeleton rows.
```

### Stage 3: First fork page arrives (1-2s)
```
Skeleton rows replaced with real fork data — basic columns only.
Stars, push date, forks count, size all visible.
Ahead/behind column shows shimmer placeholders.
Activity column shows shimmer placeholders.
Health score shows partial score (recency + stars only) with ~ prefix.
Progress bar continues: ▓▓▓▓░░░░░░ 4/29 pages
```

### Stage 4: All fork pages loaded (2-5s)
```
Progress bar completes and fades out.
"2,847 forks" count finalizes.
Table can now be sorted/filtered on basic columns.
Ahead/behind data begins lazy-loading for visible rows (top 25).
```

### Stage 5: Ahead/behind arrives per row (5-15s)
```
Each visible row's ahead/behind shimmer is replaced with real data.
Health score updates from partial (~42) to final (82).
Relevance sort re-ranks if enabled (subtle animation, row slides to new position).
Activity sparklines begin loading (lowest priority).
```

### Stage 6: Fully loaded
```
All visible rows have complete data.
Scrolling to new rows triggers lazy-load for those rows.
No more shimmers, no more skeletons.
```

**Why this matters:** A user waiting 5 seconds for a blank page will leave. A user watching data progressively appear will stay. Every stage delivers more value than the last.

---

## 8. Empty States

### Landing (no search yet)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         Find the most active forks                   │
│         of any GitHub repository                     │
│                                                      │
│   Paste a URL or try one of these:                   │
│                                                      │
│   facebook/react          torvalds/linux             │
│   microsoft/vscode        vuejs/vue                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- No icon. No illustration. Just the value proposition and examples.
- Examples are clickable — they trigger a search immediately.
- Search bar is already focused above this.

### No forks

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   This repository hasn't been forked yet.            │
│                                                      │
│   You're looking at the one and only version.        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Filters returned zero results

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   No forks match your filters.                       │
│   0 of 2,847 forks shown.                            │
│                                                      │
│   [Clear filters]   [Show all forks]                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Rate limit exhausted (before search)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   GitHub API rate limit reached.                     │
│   Resets in 47 minutes.                              │
│                                                      │
│   Add a personal access token to get                 │
│   5,000 requests per hour:                           │
│                                                      │
│   [Paste token here                          ]       │
│   [Save]                                             │
│                                                      │
│   Needs public_repo scope (read-only)                │
│   Create one → github.com/settings/tokens            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 9. Interaction Details

### 9.1 Table Sort

```
CLICK: Stars ↕  →  Stars ↑ (ascending)
CLICK: Stars ↑  →  Stars ↓ (descending)
CLICK: Stars ↓  →  Relevance ↕ (back to default sort)

SHIFT+CLICK: Add secondary sort (column header shows sort priority number)
```

Sorted column header is visually distinct: bold text + arrow indicator + subtle background.

### 9.2 Keyboard Navigation

| Key | Context | Action |
|-----|---------|--------|
| `/` | Anywhere | Focus search bar |
| `Escape` | Search focused | Clear input |
| `Escape` | Dropdown open | Close dropdown |
| `↑` `↓` | Search history | Navigate items |
| `Enter` | Search history item | Select and search |
| `j` `k` | Table focused | Move row selection down/up |
| `Enter` | Table row selected | Open fork on GitHub |
| `x` | Table row selected | Expand/collapse row detail |
| `f` | Table focused | Open filter panel |
| `t` | Anywhere | Cycle theme (light → dark → system) |
| `?` | Anywhere | Show shortcut overlay |

### 9.3 Responsive Touch Interactions

| Gesture | Mobile element | Action |
|---------|---------------|--------|
| Tap | Fork card | Open fork on GitHub |
| Long press | Fork card | Show detail (ahead/behind, description, metrics) |
| Swipe left | Fork card | Reveal "Compare" action |
| Pull down | Fork list | Refresh data |
| Tap | Quick filter chip | Toggle filter |

---

## 10. Animations

All animations respect `prefers-reduced-motion: reduce` — if enabled, use instant transitions.

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Theme switch | Toggle click | Background + text color cross-fade | 200ms | ease-in-out |
| Table row appear | Data arrives | Fade in | 150ms | ease-out |
| Row re-sort | Sort changes | Slide to new position | 300ms | ease-in-out |
| Skeleton shimmer | While loading | Linear gradient sweep | 1.5s | linear, loop |
| Progress bar | Pages fetching | Width growth | 300ms | ease-out |
| Dropdown open | Focus/click | Scale(0.95→1) + opacity(0→1) | 150ms | ease-out |
| Dropdown close | Blur/escape | Opacity(1→0) | 100ms | ease-in |
| Sparkline draw | Data arrives | SVG stroke-dashoffset reveal | 400ms | ease-out |
| Filter panel expand | Click toggle | Height auto + fade | 200ms | ease-out |
| Chip activate | Click | Background color fill | 100ms | ease-out |
| Score update | Ahead/behind loads | Number counter + color change | 300ms | ease-out |
| Toast notification | Copy link | Slide in from bottom + fade | 200ms / 3s / 150ms | ease-out / hold / ease-in |
| Row expand | Click expand | Height auto reveal | 200ms | ease-out |

---

## 11. Accessibility

| Requirement | Implementation | WCAG |
|-------------|---------------|------|
| Color is not the only signal | Health scores have numbers + labels alongside colors. Ahead/behind has ↑↓ arrows alongside green/orange | 1.4.1 |
| Text contrast | All text meets 4.5:1 against its background. UI components meet 3:1 | 1.4.3, 1.4.11 |
| Focus visible | 2px accent-colored ring on all interactive elements. Never hidden | 2.4.7 |
| Keyboard operable | All features work without mouse. Tab order follows visual layout | 2.1.1 |
| Screen reader labels | `aria-label` on icon buttons, `aria-sort` on table headers, `aria-live="polite"` on fork count and progress | 4.1.2 |
| Motion sensitivity | `prefers-reduced-motion` disables all animations. Sparklines render instantly | 2.3.3 |
| Text scaling | Layout remains functional at 200% zoom. Table scrolls, doesn't break | 1.4.4 |
| Touch targets | Minimum 44x44px for all interactive elements on mobile | 2.5.5 |
| Alt text | Avatars: `alt="{owner} avatar"`. Sparklines: `aria-label="Commit activity: 14 commits last week"` | 1.1.1 |
| Skip links | "Skip to results" link visible on focus, jumps past search to table | 2.4.1 |
| Status messages | Rate limit changes, filter result counts, loading progress announced via `aria-live` regions | 4.1.3 |

---

## 12. Design Rationale — Why Not...

| Alternative considered | Why we didn't choose it | User insight behind decision |
|----------------------|------------------------|---------------------------|
| **Card grid instead of table** (desktop) | Tables enable comparison across rows. Cards isolate items. The Evaluator's job is comparing 10 forks in columns — a table is the right tool | Evaluators need to scan a column (all ahead-counts) not a card (one fork's details) |
| **Stars as default sort** | Stars measure historical popularity, not current activity. A fork with 500 stars and no commits in 2 years is not "active" | Issue #52: "the main point of the project is to show Active Forks" |
| **Last push as default sort** | A README typo push is "recent" but meaningless. Sorts noise to the top | User research: recency ≠ relevance |
| **Require token upfront** | Kills zero-friction promise. Most searches need < 10 API calls. Token is only needed for large repos or ahead/behind enrichment | Users arrive from Google. Any friction = bounce |
| **Infinite scroll instead of pagination** | Pagination preserves URL state (page=3), enables "jump to page 40", and works with export. Infinite scroll loses your place | "Every state is a URL" principle |
| **Sidebar navigation** | There's only one page. A sidebar implies multi-page app complexity that doesn't exist | Single-purpose tool. One search bar. One table. No navigation needed |
| **Color-inverted dark mode** | Issue #79: "looks so ugly." Inversion breaks images, creates unreadable contrast, and feels amateur | Build proper dark palette with GitHub's color tokens |
| **Show all columns by default** | Data overload. The Refugee doesn't need Size, Branch, Open Issues on first view | Progressive depth: show what matters first, reveal more on demand |
