# Feature Specifications

> Every feature traces back to a user need. If a feature doesn't serve a segment, it shouldn't exist.

## Feature Map

```
User Need                          Feature That Serves It
─────────────────────────────────  ──────────────────────────────────────
"Which fork should I switch to?"   → Smart Sort + Health Score + Ahead/Behind
"Show me the real work, not noise" → Ahead/Behind Commits + Activity Sparklines
"This repo has 5000 forks"         → Full Pagination + Token Support
"Let me narrow it down"            → Advanced Filters + Column Customization
"I need to share this with my team"→ Shareable URLs + Export (CSV/JSON)
"The best fork is a fork-of-fork"  → Recursive Fork Tree
"I'm on GitHub already"            → Bookmarklet + URL Paste Detection
"It's 2am and my eyes hurt"        → Dark/Light/System Theme
```

---

## F1: Repository Search

**Serves:** All segments — every journey starts here.
**User story:** "I have a GitHub repo URL (or I know the owner/repo). I want to see its forks instantly."

### Accepted Input Formats
| Format | Example | Why support it |
|--------|---------|---------------|
| `owner/repo` | `facebook/react` | Power users type this |
| Full URL | `https://github.com/facebook/react` | Most common — users copy from browser |
| URL with trailing paths | `https://github.com/facebook/react/tree/main` | Users copy from deep pages |
| URL with `.git` suffix | `https://github.com/facebook/react.git` | Copied from clone dialogs |

### Key Behavior
- **Auto-detect paste:** When a user pastes a GitHub URL, auto-parse and trigger search. This is the #1 entry point.
- Strip protocol, domain, `.git`, trailing slashes, path segments
- Validate `owner/repo` pattern before API call
- Update URL query parameter (`?repo=facebook/react`) for shareability

### Error States

Every error must be **actionable** — tell the user what to do next, not just what went wrong.

| Condition | Message | Action |
|-----------|---------|--------|
| Empty input | "Enter a repository — like `facebook/react` or paste a GitHub URL" | Focus input |
| Invalid format | "Couldn't parse that. Try `owner/repo` format" | Highlight input |
| 404 Not Found | "Repository `facbook/react` not found. Did you mean `facebook/react`?" | Suggest correction |
| 403 Rate Limited | "API rate limit hit. Add a GitHub token for 5,000 requests/hour →" | Expand token input |
| Network error | "Network error. Check your connection and try again." | Retry button |

---

## F2: Fork Data Table

**Serves:** Refugees (quick scan), Evaluators (deep comparison), Mappers (full picture).
**User story:** "I want to see all forks in a sortable, filterable table so I can find the ones that matter."

### Columns

| Column | Source | Sortable | Why it's here |
|--------|--------|----------|---------------|
| Owner | avatar + `owner.login` | Yes | Identity — "who is behind this fork?" |
| Repository | `full_name` (link) | Yes | Navigation — click to visit |
| Ahead/Behind | Compare API | Yes | **The core question:** "did they do real work?" |
| Stars | `stargazers_count` | Yes | Social proof — community votes |
| Last Push | `pushed_at` (relative) | Yes | Recency signal — but unreliable alone |
| Health Score | Computed | Yes | Composite answer for Refugees |
| Activity | Sparkline SVG | No | Visual "alive or dead?" at a glance |
| Forks | `forks_count` | Yes | Indicates sub-community |
| Open Issues | `open_issues_count` | Yes | Active maintenance signal |
| Size | `size` (humanized) | Yes | Rough change magnitude |
| Default Branch | `default_branch` | No | Context for comparison |

### Default Sort: Relevance Score

**Not stars. Not last push. A composite.**

The original tool sorts by stars (Issue #52: wrong). Users say sort by last push (also wrong — a README typo is "recent"). We sort by **relevance**:

```
relevance = (
  normalized_ahead_commits * 0.40 +   // Most important: real independent work
  normalized_stars * 0.25 +            // Community endorsement
  normalized_recency * 0.20 +          // Still alive
  normalized_forks * 0.10 +            // Sub-community formed
  has_description_changed * 0.05       // Intentional rebrand
)
```

Users can override to sort by any single column. The relevance sort is just the smart default.

### Table Features
- **Sticky header:** Table header stays visible on scroll
- **Pagination:** 25 / 50 / 100 rows per page
- **Column visibility:** Toggle columns on/off; persist in localStorage
- **Virtual scrolling:** For datasets > 500 rows (TanStack Virtual)
- **Row hover:** Subtle highlight with "Open on GitHub" action

---

## F3: Ahead/Behind Comparison

**Serves:** Evaluators (primary), Refugees (secondary).
**User story:** "I need to know which forks actually added commits, not just which ones were pushed to recently."

> *"An 'ahead' column would give you a good idea which branches have actually been worked on independently by the forker. These are the only interesting ones!"* — countingpine, Issue #17

### Data Source
```
GET /repos/{parent_owner}/{parent_repo}/compare/{parent_branch}...{fork_owner}:{fork_branch}
```
Returns `ahead_by` and `behind_by` counts.

### Display States
```
  ↑ 24 ahead  ↓ 2 behind    — Active divergence (green + orange pills)
  ↑ 5 ahead   · even         — Ahead and up-to-date (green pill)
  · even      ↓ 142 behind   — Abandoned clone (gray + red pills)
  · identical                 — Exact copy, no changes (gray pill)
  ░░░░░░░░░                  — Loading (skeleton shimmer)
  ⚠ unavailable              — API error or rate limited
```

### Performance (critical — this is the expensive feature)
- **Lazy loading:** Only fetch for rows visible in the viewport (IntersectionObserver)
- **Throttled:** Max 5 concurrent comparison requests
- **Cached:** 5-minute stale-while-revalidate via TanStack Query
- **Progressive:** Table renders immediately with basic data; ahead/behind fills in as it loads
- **Rate-limit aware:** Stop fetching when approaching limit; show "Add token for more data"

### Why This Is Hard (and why it's been requested for 7 years)

Each fork needs 1 API call to get ahead/behind. A repo with 500 forks needs 500 calls. At 60/hr unauthenticated, that's 8+ hours. Even with a token (5,000/hr), a repo with 5,000 forks takes an hour.

**Our approach:** Lazy-load only visible rows. Most users look at 25-50 forks. That's 25-50 API calls — well within limits.

---

## F4: Full Fork Pagination

**Serves:** Mappers (primary), Evaluators (secondary).
**User story:** "React has 20K forks. Showing me the first 100 means I'm missing 99.5% of them."

### Implementation
1. First request: `GET /repos/{owner}/{repo}/forks?per_page=100&page=1`
2. Parse `Link` header → know total pages
3. Fetch remaining pages in parallel (max 5 concurrent)
4. Progressive display: render forks as pages arrive, don't wait for all pages

### Progress UX
```
┌──────────────────────────────────────────────────┐
│  Fetching forks...  ████████░░░░  800 / 2,400    │
│  Using 24 of 60 API requests remaining            │
└──────────────────────────────────────────────────┘
```

### Rate Limit Awareness
- **Before fetching:** "This repo has ~2,400 forks. Fetching all will use 24 API requests. You have 42 remaining."
- **If insufficient:** "You need 24 requests but only have 18 remaining. Add a token or fetch the first 1,800."
- **User control:** Let users choose how many pages to fetch

---

## F5: Theme System

**Serves:** Everyone (especially late-night developers).
**User story:** "The dark mode currently just inverts colors and 'looks so ugly.'" (Issue #79)

### Three modes
| Mode | Behavior | Icon |
|------|----------|------|
| Light | Force light theme | Sun |
| Dark | Force dark theme (proper dark palette, not inverted) | Moon |
| System | Follow OS `prefers-color-scheme` | Monitor |

### Requirements
- GitHub-inspired dark palette (not just "invert colors")
- Smooth 200ms color transitions
- Persist choice in `localStorage`
- Respect `prefers-reduced-motion` for transitions
- Toggle in the header — prominent but not distracting

---

## F6: Shareable URLs

**Serves:** Refugees (sharing in issue threads), Evaluators (sharing with team).
**User story:** "I found the right fork. I want to send my teammate a link that shows exactly what I'm seeing."

### URL Structure
```
https://forks.example.com/?repo=facebook/react&sort=ahead&order=desc&filter=ahead:gt:0&page=2
```

### Parameters
| Param | Description | Example |
|-------|-------------|---------|
| `repo` | Repository to search | `facebook/react` |
| `sort` | Sort column | `relevance`, `stars`, `ahead`, `pushed` |
| `order` | Sort direction | `asc`, `desc` |
| `filter` | Active filter expression | `ahead:gt:0`, `pushed:within:6m` |
| `page` | Table page number | `2` |
| `per_page` | Rows per page | `25`, `50`, `100` |

### Behavior
- URL updates on every interaction (replaceState — no back-button pollution)
- Page load restores full state from URL
- "Copy link" button with visual confirmation
- Open Graph `<meta>` tags for rich link previews when shared

---

## F7: GitHub Token Management

**Serves:** Everyone who hits the rate limit (almost everyone with popular repos).
**User story:** "I got a 403 error. I need to understand why and fix it with minimal friction."

### Progressive UX

**State 1: No token, plenty of requests**
```
Rate limit: 52/60 remaining
```
Small, non-intrusive indicator in the header.

**State 2: No token, running low**
```
⚠ 8/60 API requests remaining — Add a GitHub token for 5,000/hr →
```
Yellow warning. Expandable token input.

**State 3: No token, exhausted**
```
✕ API rate limit exceeded. Resets in 47 minutes.
   Add a GitHub token to continue now →
   ┌─────────────────────────────────────────────────┐
   │  Paste your GitHub Personal Access Token         │
   │  [•••••••••••••••••••••ghp_xxx]  [Save] [Cancel] │
   │  Needs: public_repo scope (read-only)            │
   │  Create one at github.com/settings/tokens        │
   └─────────────────────────────────────────────────┘
```
Auto-expanded. Direct link to token creation. Minimal scope explained.

**State 4: Token saved**
```
✓ Authenticated — 4,892/5,000 remaining     [Clear token]
```

### Security
- Token in `localStorage` only — never sent to any server except `api.github.com`
- Validated on save (test with `/user` endpoint)
- `public_repo` scope = read-only access to public repos
- One-click clear with confirmation

---

## F8: Fork Health Score

**Serves:** Refugees — "Just tell me which fork is the best."
**User story:** "I don't want to analyze 50 forks. Give me a number that tells me which one is the real successor."

### Algorithm

```
health_score = (
  ahead_weight    * min(ahead_commits / 50, 1.0)   +   // 0-1: divergent work (capped at 50)
  recency_weight  * recency_factor                  +   // 0-1: last push within 0-365 days
  stars_weight    * min(stars / 100, 1.0)           +   // 0-1: community endorsement
  forks_weight    * min(forks / 20, 1.0)            +   // 0-1: sub-community
  issues_weight   * (has_issues ? 0.5 : 0)          +   // 0 or 0.5: issues enabled = maintained
  desc_weight     * (description_changed ? 1.0 : 0)     // 0 or 1: intentional rebrand
)

Default weights: ahead=40, recency=25, stars=15, forks=10, issues=5, desc=5
Final score: normalize to 0-100
```

### Recency Factor
```
days_since_push = 0   → 1.0
days_since_push = 30  → 0.9
days_since_push = 90  → 0.7
days_since_push = 180 → 0.4
days_since_push = 365 → 0.1
days_since_push > 365 → 0.0
```

### Display
| Range | Label | Badge Color |
|-------|-------|-------------|
| 80-100 | Thriving | Blue |
| 60-79 | Active | Green |
| 40-59 | Moderate | Yellow |
| 20-39 | Low | Orange |
| 0-19 | Inactive | Gray |

### Note
Health score requires ahead/behind data to be fully accurate. Before ahead/behind loads, show a partial score with a "loading" indicator. This naturally creates progressive disclosure.

---

## F9: Commit Activity Sparklines

**Serves:** Evaluators — "Is this fork consistently active or was it a one-time push?"
**User story:** "A fork was pushed 2 days ago, but I want to know if that's a burst or sustained effort."

### Data Source
```
GET /repos/{owner}/{repo}/stats/commit_activity
→ Returns 52 weeks of commit counts
```

### Display
```
▁▁▃▅▇█▅▃▁▁▃▅▆▇▇▅▃▁▁▁▃▅██▇▅▃▁     120px × 24px inline SVG
                    └── recent burst
```

- Hover tooltip: "Week of Jan 6: 14 commits"
- Color: theme-aware (muted gray, highlighted on hover)
- Empty forks: show flat line or "No activity"

### Performance
- **Lazy loaded:** Only fetch for visible rows (same IntersectionObserver as ahead/behind)
- **Cached:** 10-minute stale-while-revalidate
- **Low priority:** Fetch after ahead/behind data (ahead/behind is more useful)

---

## F10: Recursive Fork Tree

**Serves:** Mappers — "The real successor might be a fork-of-a-fork."
**User story (real):** The most active continuation of MonitorControl.OSX was a fork-of-a-fork that didn't appear in the original fork list. (Issue #31)

### Behavior
1. Fork table shows direct forks (level 1) by default
2. Each fork row has an expand arrow if it has sub-forks
3. Click expand → fetch that fork's forks → show as indented rows
4. Expand indicator shows sub-fork count: `▶ 12 sub-forks`

### Limits
- Max depth: 3 levels
- Lazy load: sub-forks fetched only on expand click
- Rate limit warning: "Loading sub-forks for all 200 entries will use ~200 API requests"

### Table Display
```
  facebook/react           ⭐ 220k  ↑ 0   ↓ 0    ── parent
  ├─ user-a/react          ⭐ 45    ↑ 12  ↓ 3    ── direct fork
  │  └─ user-b/react       ⭐ 8     ↑ 24  ↓ 3    ── fork-of-fork ← hidden gem!
  ├─ user-c/react          ⭐ 120   ↑ 89  ↓ 56
  └─ user-d/react          ⭐ 3     ↑ 1   ↓ 142
```

---

## F11: Parent Repository Card

**Serves:** All segments — the baseline context for evaluating forks.
**User story:** "Before I look at forks, I want to understand the original — how popular is it, when was it last maintained, what license does it use?"

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  facebook/react                                    [GitHub →]│
│  A JavaScript library for building user interfaces          │
│                                                              │
│  ⭐ 220k   🔱 45k   📝 1.2k issues   📄 MIT   🟡 JavaScript │
│  Last push: 2 days ago   Created: May 2013                  │
│  Topics: javascript · react · frontend · ui                 │
└─────────────────────────────────────────────────────────────┘
│  Showing 2,847 forks                                        │
```

Shows: name (linked), description, stars, forks, issues, license, language (with color dot), last push, creation date, topics.

---

## F12: Advanced Filters

**Serves:** Evaluators — "Show me only the forks that matter."
**User story:** "There are 2,000 forks. I want to see only forks that are ahead of the original and were pushed within the last year."

### Filter Controls

| Filter | Type | Why |
|--------|------|-----|
| Stars | `≥ N` | Minimum community endorsement |
| Last Push | `within N months` | Recency cutoff |
| Ahead commits | `≥ N` | Has meaningful independent work |
| Behind commits | `≤ N` | Not too far behind to be usable |
| Has issues enabled | Toggle | Signal of active maintenance |
| Health score | `≥ N` slider | Quick "show me the good ones" |

### Quick Filters (one-click)
- **"Show meaningful forks"** — ahead > 0, pushed within 1 year, stars > 0
- **"Show active forks"** — pushed within 6 months
- **"Show all"** — remove all filters

### Behavior
- Filter panel collapses by default (progressive depth)
- Shows count: "Showing 47 of 2,847 forks"
- Filters reflected in URL for shareability
- Clear all filters button

---

## F13: Export (CSV/JSON)

**Serves:** Evaluators and Mappers — "I need to share this analysis or process it elsewhere."
**User story:** "I found the top 10 forks. I want to drop this into a spreadsheet for my team."

### Formats
| Format | Content |
|--------|---------|
| CSV | All visible columns, respecting current sort and filters |
| JSON | Full fork data objects for filtered results |

### Behavior
- Export button in toolbar: `↓ Export ▾` dropdown
- Filename: `forks-facebook-react-2026-02-12.csv`
- Exports current view (filtered + sorted, not all data)
- Includes ahead/behind if loaded
- File download — no server involved

---

## F14: Search History

**Serves:** Repeat users — "I keep coming back to check the same repos."
**User story:** "I checked torvalds/linux forks last week. I want to quickly re-check without typing it again."

### Behavior
- Dropdown appears on search input focus
- Shows last 20 searches with: `owner/repo`, star count, when searched
- Click to re-search
- "Clear history" option
- Keyboard navigable (arrow keys + enter)
- Stored in `localStorage`

### Display
```
┌─────────────────────────────────────┐
│  Recent searches                    │
│  ─────────────────────────────────  │
│  torvalds/linux          ⭐ 170k   │
│  facebook/react          ⭐ 220k   │
│  techgaun/active-forks   ⭐ 2.4k   │
│  ─────────────────────────────────  │
│  Clear history                      │
└─────────────────────────────────────┘
```

---

## F15: Bookmarklet

**Serves:** Integrators — "I'm already on a GitHub page."
**User story:** "I'm looking at a repo on GitHub. One click should show me its forks."

### Implementation
```javascript
javascript:void(window.open('https://forks.example.com/?repo='+window.location.pathname.split('/').slice(1,3).join('/')))
```

### Installation
- Drag-to-bookmarks-bar installation on the site
- Works on any `github.com/{owner}/{repo}` page
- Opens our app in a new tab with the repo pre-filled

---

## Feature Priority Matrix

| Feature | Refugee | Evaluator | Mapper | Integrator | Phase |
|---------|---------|-----------|--------|------------|-------|
| F1: Search | Must | Must | Must | Must | 1 |
| F2: Fork Table | Must | Must | Must | Must | 1 |
| F3: Ahead/Behind | High | **Must** | High | Medium | 1 |
| F4: Full Pagination | Medium | High | **Must** | Low | 1 |
| F5: Theme | Medium | Medium | Medium | Medium | 1 |
| F6: Shareable URLs | High | High | High | High | 1 |
| F7: Token Management | High | High | **Must** | Medium | 1 |
| F8: Health Score | **Must** | High | Medium | Low | 2 |
| F9: Sparklines | Medium | High | Medium | Low | 2 |
| F10: Recursive Tree | Low | Medium | **Must** | Low | 2 |
| F11: Parent Card | High | High | High | Medium | 1 |
| F12: Filters | Medium | **Must** | High | Low | 2 |
| F13: Export | Low | High | High | Low | 3 |
| F14: Search History | Medium | Medium | Medium | High | 2 |
| F15: Bookmarklet | Low | Low | Low | **Must** | 1 |
