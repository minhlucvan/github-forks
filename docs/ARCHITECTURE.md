# Architecture

> **Philosophy:** Use ready-made tools. Don't build what shadcn/ui already ships.
> Customize the theme, compose the components, write the business logic. That's it.

---

## 1. Stack

| Layer | Choice | Why this, not something else |
|-------|--------|------------------------------|
| **Framework** | React 18 + TypeScript | Component model, ecosystem, typing. No Next.js — we don't need SSR, API routes, or a server. This is a static client-side tool |
| **Build** | Vite | Fast HMR, optimized production builds, native TS support. Deploys as static HTML/JS/CSS |
| **UI Components** | **shadcn/ui** | Pre-built accessible components (Table, Card, Badge, Button, Skeleton, etc.). Copy-pasted into our repo — no dependency lock-in. Built on Radix UI primitives |
| **Styling** | Tailwind CSS v4 | Utility-first. shadcn/ui requires it. Theme via CSS custom properties |
| **Theming** | shadcn CSS variables + ThemeProvider | Light/dark/system out of the box. OKLCH color space. Just override the variables |
| **Icons** | Lucide React | shadcn/ui default. Tree-shakeable. 1,500+ icons |
| **Data Table** | TanStack Table + shadcn Table | Headless sorting/filtering/pagination (TanStack) rendered with shadcn Table components. shadcn has an official data-table recipe |
| **Server State** | TanStack Query | Caching, pagination, stale-while-revalidate, request deduplication. Built for API-heavy apps |
| **Toasts** | Sonner (via shadcn) | `npx shadcn@latest add sonner`. Used for "Link copied" and error notifications |
| **Testing** | Vitest + Testing Library | Vite-native, fast. Tests run in the same pipeline as the build |
| **Linting** | ESLint + Prettier | Code quality. shadcn/ui projects use these by convention |
| **CI/CD** | GitHub Actions | Lint → test → build → deploy to GitHub Pages |
| **Hosting** | GitHub Pages | Free, static, custom domain. No server to maintain |

### What we DON'T use

| Avoided | Why |
|---------|-----|
| Next.js | No SSR/SSG needed. Adds 200KB+ to bundle for features we won't use. This is a static tool |
| React Router | Single-page app with one view. URL state managed via `URLSearchParams` directly |
| Zustand / Redux | TanStack Query handles server state. UI state is local (`useState`). No global store needed |
| Styled Components / CSS Modules | Tailwind + shadcn CSS variables handle everything |
| Custom component library | shadcn/ui provides every primitive we need. Building our own wastes time |
| Backend / database | 100% client-side. GitHub API is our only data source. Token stored in localStorage |

---

## 2. Setup (Zero to Running in 5 Minutes)

```bash
# 1. Create project
npm create vite@latest github-forks -- --template react-ts
cd github-forks

# 2. Install Tailwind v4
npm install tailwindcss @tailwindcss/vite

# 3. Path aliases (for @/ imports)
npm install -D @types/node

# 4. Initialize shadcn/ui
npx shadcn@latest init -d

# 5. Install all the components we need
npx shadcn@latest add table card badge button input skeleton \
  tooltip dropdown-menu command progress slider checkbox \
  toggle-group popover alert separator sheet select \
  pagination scroll-area sonner avatar label

# 6. Install business logic dependencies
npm install @tanstack/react-table @tanstack/react-query

# 7. Done. Start dev server
npm run dev
```

After `shadcn init`, the project has:
- `components.json` — shadcn configuration
- `src/index.css` — Tailwind directives + full CSS variable theme (light + dark)
- `src/lib/utils.ts` — the `cn()` class merge utility
- `src/components/ui/` — all installed components (copy-pasted, fully editable)

---

## 3. Project Structure

```
github-forks/
├── docs/                              # You are here
├── public/
│   ├── favicon.svg
│   └── og-image.png                   # Social preview for shared links
├── src/
│   ├── components/
│   │   ├── ui/                        # ← shadcn/ui primitives (DO NOT hand-write these)
│   │   │   ├── table.tsx              #   npx shadcn@latest add table
│   │   │   ├── card.tsx               #   npx shadcn@latest add card
│   │   │   ├── badge.tsx              #   npx shadcn@latest add badge
│   │   │   ├── button.tsx             #   npx shadcn@latest add button
│   │   │   ├── input.tsx              #   npx shadcn@latest add input
│   │   │   ├── skeleton.tsx           #   npx shadcn@latest add skeleton
│   │   │   ├── tooltip.tsx            #   ...
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── command.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── select.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── theme-provider.tsx         # shadcn Vite theme provider (Light/Dark/System)
│   │   ├── mode-toggle.tsx            # Theme dropdown toggle (shadcn recipe)
│   │   │
│   │   ├── search-bar.tsx             # Repo input + paste detection + history dropdown
│   │   ├── search-history.tsx         # Command-based recent searches list
│   │   ├── repo-card.tsx              # Parent repository info card
│   │   ├── fork-table.tsx             # TanStack Table + shadcn Table composition
│   │   ├── fork-columns.tsx           # Column definitions for TanStack Table
│   │   ├── fork-toolbar.tsx           # Quick filters + filter panel + export + column toggle
│   │   ├── fork-filters.tsx           # Advanced filter panel (stars, push date, ahead, health)
│   │   ├── ahead-behind-badge.tsx     # Ahead/behind pill badges
│   │   ├── health-score-badge.tsx     # Composite score colored badge
│   │   ├── activity-sparkline.tsx     # Inline SVG sparkline (custom — no shadcn equivalent)
│   │   ├── rate-limit-indicator.tsx   # Escalating rate limit display + token input
│   │   ├── export-menu.tsx            # CSV/JSON export dropdown
│   │   ├── fork-tree-row.tsx          # Expandable sub-fork rows
│   │   └── empty-state.tsx            # Landing, no forks, no filter results
│   │
│   ├── hooks/
│   │   ├── use-forks.ts              # Fork list fetching with all-page pagination
│   │   ├── use-repo.ts               # Parent repo metadata
│   │   ├── use-ahead-behind.ts       # Per-fork comparison (lazy, viewport-aware)
│   │   ├── use-commit-activity.ts    # Per-fork sparkline data (lazy, low priority)
│   │   ├── use-github-token.ts       # Token storage, validation, rate limit tracking
│   │   ├── use-search-history.ts     # localStorage-backed recent searches
│   │   ├── use-url-state.ts          # Sync sort/filter/page with URL search params
│   │   └── use-intersection.ts       # IntersectionObserver for lazy data loading
│   │
│   ├── lib/
│   │   ├── utils.ts                  # cn() — generated by shadcn init
│   │   ├── github.ts                 # GitHub API client (fetch wrapper, auth, error handling)
│   │   ├── github-types.ts           # API response type definitions
│   │   ├── rate-limit.ts             # Rate limit state tracking
│   │   ├── fork-score.ts             # Health score algorithm
│   │   ├── relevance-sort.ts         # Default sort: ahead*0.4 + stars*0.25 + recency*0.2 + ...
│   │   ├── url-parser.ts             # Parse GitHub URLs to owner/repo
│   │   ├── export.ts                 # CSV/JSON generation
│   │   ├── format.ts                 # Date (relative), number (humanized), size formatting
│   │   └── constants.ts              # API URLs, rate limits, defaults
│   │
│   ├── App.tsx                       # Root: ThemeProvider + QueryClientProvider + layout
│   ├── main.tsx                      # Entry: ReactDOM.createRoot
│   └── index.css                     # Tailwind v4 directives + shadcn CSS variables + custom tokens
│
├── tests/
│   ├── lib/
│   │   ├── github.test.ts
│   │   ├── fork-score.test.ts
│   │   ├── relevance-sort.test.ts
│   │   ├── url-parser.test.ts
│   │   └── format.test.ts
│   └── hooks/
│       ├── use-forks.test.ts
│       └── use-url-state.test.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR: lint + test + build
│       └── deploy.yml                # Main: build + deploy to GitHub Pages
│
├── index.html                        # Vite entry + OG meta tags
├── components.json                   # shadcn/ui configuration
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── eslint.config.js
```

### What we write vs. what shadcn gives us

| Component | Source | Effort |
|-----------|--------|--------|
| Table, Card, Badge, Button, Input, Skeleton, Tooltip, Dropdown, Command, Progress, Slider, Checkbox, ToggleGroup, Popover, Alert, Sheet, Select, Pagination, Avatar | **shadcn/ui** (`npx shadcn@latest add`) | Zero — install and use |
| ThemeProvider, ModeToggle | **shadcn recipe** (copy from docs) | Minimal — paste and adapt |
| DataTable (TanStack + shadcn Table) | **shadcn data-table recipe** + customization | Moderate — follow recipe, add our columns |
| SearchBar, RepoCard, ForkToolbar, ForkFilters, RateLimitIndicator, ExportMenu, EmptyState | **Our composition** of shadcn primitives | Moderate — compose shadcn components with our logic |
| AheadBehindBadge, HealthScoreBadge | **Custom Badge variants** extending shadcn Badge | Small — add CSS variants |
| ActivitySparkline | **Custom** — inline SVG | Small — no shadcn equivalent exists |
| All hooks (`use-forks`, `use-ahead-behind`, etc.) | **Custom** — our business logic | Primary development effort |
| All lib (`github.ts`, `fork-score.ts`, etc.) | **Custom** — our business logic | Primary development effort |

**The ratio: ~70% shadcn out-of-the-box, ~30% our business logic.**

---

## 4. Theming

### How it works

shadcn/ui defines semantic color tokens as CSS custom properties. All components reference these tokens (`bg-primary`, `text-muted-foreground`). Light and dark modes are just different values for the same variables.

```
Tailwind class: bg-primary
  ↓
@theme inline: --color-primary: var(--primary)
  ↓
:root (light): --primary: oklch(0.205 0 0)
.dark (dark):  --primary: oklch(0.985 0 0)
```

Toggling themes = adding/removing `.dark` class on `<html>`. The ThemeProvider handles this + localStorage persistence + system preference detection.

### Our custom color tokens

We extend shadcn's default palette with domain-specific colors. Add these to `src/index.css`:

```css
/* ── Our custom semantic tokens ── */

:root {
  /* Fork divergence signals */
  --ahead: oklch(0.65 0.19 160);          /* green — "real work happened" */
  --ahead-foreground: oklch(1 0 0);
  --behind: oklch(0.70 0.15 65);          /* amber — "drifting from parent" */
  --behind-foreground: oklch(0.25 0.05 60);

  /* Health score tiers */
  --score-thriving: oklch(0.62 0.19 255);  /* blue */
  --score-active: oklch(0.65 0.19 160);    /* green */
  --score-moderate: oklch(0.70 0.15 65);   /* yellow */
  --score-low: oklch(0.65 0.20 35);        /* orange */
  --score-inactive: oklch(0.55 0 0);       /* gray */
}

.dark {
  --ahead: oklch(0.65 0.20 155);
  --ahead-foreground: oklch(0.98 0 0);
  --behind: oklch(0.65 0.15 60);
  --behind-foreground: oklch(0.98 0 0);

  --score-thriving: oklch(0.65 0.20 260);
  --score-active: oklch(0.65 0.20 155);
  --score-moderate: oklch(0.65 0.15 60);
  --score-low: oklch(0.65 0.20 40);
  --score-inactive: oklch(0.40 0 0);
}

@theme inline {
  --color-ahead: var(--ahead);
  --color-ahead-foreground: var(--ahead-foreground);
  --color-behind: var(--behind);
  --color-behind-foreground: var(--behind-foreground);
  --color-score-thriving: var(--score-thriving);
  --color-score-active: var(--score-active);
  --color-score-moderate: var(--score-moderate);
  --color-score-low: var(--score-low);
  --color-score-inactive: var(--score-inactive);
}
```

This enables Tailwind classes like `bg-ahead`, `text-behind`, `bg-score-thriving` everywhere — and they auto-switch between light and dark mode.

### Theme toggle

The shadcn Vite ThemeProvider gives us three modes for free:

| Mode | Behavior |
|------|----------|
| Light | `.light` on `<html>`, `:root` variables apply |
| Dark | `.dark` on `<html>`, `.dark` variables apply |
| System | Reads `prefers-color-scheme`, applies matching class |

The `ModeToggle` component (from shadcn docs) is a `DropdownMenu` with Sun/Moon/Monitor icons. We place it in the header. That's it.

### GitHub-inspired dark palette

We use shadcn's `neutral` base color and override specific tokens to match GitHub's dark mode (`#0d1117` background, `#f0f6fc` text) because our users live on GitHub. Use [tweakcn.com](https://tweakcn.com/) to visually adjust the OKLCH values.

---

## 5. Component Mapping (UI-UX.md → shadcn)

Every component in [UI-UX.md](./UI-UX.md) maps to a shadcn primitive:

| UI-UX Component | shadcn Components Used | Custom Logic |
|-----------------|----------------------|--------------|
| **Header** | — (plain `<header>` + flex) | Rate limit display, theme toggle, GitHub link |
| **Search Bar** | `Input` + `Button` + `Command` (for history dropdown) | URL parsing, paste detection, auto-submit |
| **Search History** | `Command` (CommandList, CommandItem, CommandEmpty) | localStorage read/write |
| **Parent Repo Card** | `Card` (CardHeader, CardContent) + `Badge` (topics) + `Avatar` | API data display |
| **Fork Table** | `Table` (all sub-components) + TanStack Table | Sorting, pagination, column visibility, virtual scroll |
| **Quick Filter Chips** | `ToggleGroup` + `ToggleGroupItem` | Predefined filter presets ("Meaningful", "Active", "All") |
| **Advanced Filters** | `Popover` (desktop) / `Sheet` (mobile) + `Input` + `Select` + `Slider` + `Checkbox` | Filter state → URL sync |
| **Ahead/Behind Badge** | `Badge` (custom variants: `ahead`, `behind`, `identical`) | Color based on ahead/behind values |
| **Health Score Badge** | `Badge` (custom variants: `thriving`, `active`, `moderate`, `low`, `inactive`) | Score calculation, partial score during loading |
| **Activity Sparkline** | Custom inline SVG (no shadcn equivalent) | 52-point sparkline, theme-aware colors |
| **Rate Limit Indicator** | `Alert` (escalating variants) + `Input` (token) + `Button` | 4-state escalation logic |
| **Export Menu** | `DropdownMenu` + `DropdownMenuItem` | CSV/JSON generation, file download |
| **Column Toggle** | `DropdownMenu` + `DropdownMenuCheckboxItem` | shadcn data-table recipe (built-in) |
| **Pagination** | `Pagination` + `Select` (page size) | shadcn component, TanStack controls |
| **Empty States** | `Card` + text | Landing, no forks, no filter results, rate limit |
| **Theme Toggle** | `DropdownMenu` + `Button` + Lucide icons | shadcn recipe (Sun/Moon/Monitor) |
| **Toasts** | `Sonner` | "Link copied", error notifications |
| **Loading Skeletons** | `Skeleton` + `Progress` | Shimmer rows, progress bar for multi-page fetch |
| **Tooltips** | `Tooltip` (TooltipTrigger, TooltipContent) | Health score formula, sparkline week details |
| **Mobile Filter Sheet** | `Sheet` (side="bottom") | Slide-up filter panel on mobile |
| **Fork Tree Indentation** | Custom with `Table` rows + CSS padding | Expand/collapse, tree-line rendering |

### Custom Badge Variants

Extend shadcn's Badge with our domain-specific variants in `src/components/ui/badge.tsx`:

```typescript
// Add to the badgeVariants cva() call:
const badgeVariants = cva("...", {
  variants: {
    variant: {
      // ... existing shadcn variants (default, secondary, destructive, outline)
      ahead: "bg-ahead text-ahead-foreground",
      behind: "bg-behind text-behind-foreground",
      identical: "bg-muted text-muted-foreground",
      thriving: "bg-score-thriving text-white",
      active: "bg-score-active text-white",
      moderate: "bg-score-moderate text-score-moderate-foreground",
      low: "bg-score-low text-white",
      inactive: "bg-score-inactive text-white",
    },
  },
})
```

That's the only shadcn component we need to modify. Everything else is used as-is.

---

## 6. Data Flow

```
  User pastes URL
       │
       ▼
  ┌─────────────┐     ┌───────────────────────┐     ┌─────────────────┐
  │  SearchBar   │────▶│  URL State (search     │────▶│  GitHub REST API │
  │  (Input +    │     │  params → repo, sort,  │     │  /repos/{}/forks │
  │  Command)    │     │  filter, page)         │     │  ?per_page=100   │
  └─────────────┘     └───────────────────────┘     └────────┬────────┘
                              │                              │
                       URL updates on                  Paginated fetch
                       every interaction               (parallel pages)
                              │                              │
                       ┌──────▼──────────────────────────────▼────────┐
                       │              TanStack Query                   │
                       │  ┌─────────────┐  ┌─────────────────────┐    │
                       │  │ useRepo     │  │ useForks            │    │
                       │  │ (stale: 5m) │  │ (stale: 5m, all     │    │
                       │  │             │  │  pages merged)       │    │
                       │  └──────┬──────┘  └──────────┬──────────┘    │
                       │         │                    │               │
                       │  ┌──────▼────────────────────▼──────────┐    │
                       │  │ useAheadBehind (per visible fork)    │    │
                       │  │ Lazy: IntersectionObserver + queue   │    │
                       │  │ Max 5 concurrent. Stale: 5m          │    │
                       │  └──────────────────┬───────────────────┘    │
                       │                     │                        │
                       │  ┌──────────────────▼───────────────────┐    │
                       │  │ useCommitActivity (per visible fork) │    │
                       │  │ Lower priority than ahead/behind     │    │
                       │  │ Fetched after ahead/behind resolves  │    │
                       │  └──────────────────────────────────────┘    │
                       └──────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
             ┌──────▼──────┐    ┌────────▼────────┐    ┌──────▼──────┐
             │  RepoCard   │    │  ForkTable       │    │  Toolbar    │
             │  (Card)     │    │  (Table +         │    │  (Filters + │
             │             │    │   TanStack Table) │    │   Export)   │
             └─────────────┘    └─────────────────┘    └─────────────┘
```

### State Layers

```
┌────────────────────────────────────────────────────────────────┐
│  URL Search Params (source of truth for shareable state)       │
│  ?repo=facebook/react&sort=ahead&order=desc&filter=ahead:gt:0  │
│  Synced via useUrlState hook. Every interaction = replaceState  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  TanStack Query (server state cache)                           │
│  • Repo metadata (stale: 5 min)                                │
│  • Fork list — all pages merged (stale: 5 min)                 │
│  • Ahead/behind per fork (stale: 5 min, lazy per viewport)     │
│  • Commit activity per fork (stale: 10 min, lazy, low priority)│
│  Auto-deduplicates. Background refetch. Request cancellation.  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  React local state (component-level, not shared)               │
│  • Filter panel open/closed                                    │
│  • Column visibility toggles                                   │
│  • Expanded row IDs                                            │
│  • Search input text (before submission)                       │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  localStorage (persistent user preferences)                    │
│  • Theme: "light" | "dark" | "system"                          │
│  • GitHub token (plaintext — only sent to api.github.com)      │
│  • Search history (last 20 repos)                              │
│  • Column visibility preferences                               │
└────────────────────────────────────────────────────────────────┘
```

### No global state library

We don't need Zustand, Redux, or Jotai. Here's why:

- **Server state** (API data) → TanStack Query handles caching, deduplication, background refresh
- **URL state** (sort, filter, page) → `URLSearchParams` + custom `useUrlState` hook
- **UI state** (panel open, expanded rows) → local `useState` in the component that owns it
- **Persistent state** (theme, token, history) → localStorage + custom hooks

Three layers, zero global stores.

---

## 7. API Strategy

### REST only (v1)

No GraphQL. The GitHub REST API gives us everything we need without requiring a token:

| Endpoint | Purpose | Auth required? |
|----------|---------|---------------|
| `GET /repos/{owner}/{repo}` | Parent repo metadata | No |
| `GET /repos/{owner}/{repo}/forks?per_page=100&page=N` | Fork list (paginated) | No |
| `GET /repos/{owner}/{repo}/compare/{base}...{head}` | Ahead/behind for one fork | No |
| `GET /repos/{owner}/{repo}/stats/commit_activity` | 52-week commit sparkline | No |

GraphQL would reduce request count but **requires a token** — killing our zero-friction principle. We add GraphQL in v2 if users have a token saved.

### Pagination (get ALL forks)

```typescript
async function fetchAllForks(repo: string, token?: string) {
  // Page 1: learn total count from Link header
  const first = await fetchForks(repo, { page: 1, per_page: 100 }, token);
  const totalPages = parseLinkHeader(first.headers.get("Link"));

  // Remaining pages: parallel fetch (throttled to 5 concurrent)
  const pages = await promisePool(
    range(2, totalPages + 1).map(page =>
      () => fetchForks(repo, { page, per_page: 100 }, token)
    ),
    { concurrency: 5 }
  );

  return [first.data, ...pages.map(p => p.data)].flat();
}
```

### Rate Limit Management

```
Every API response includes:
  X-RateLimit-Limit:     60 (or 5000 with token)
  X-RateLimit-Remaining: 42
  X-RateLimit-Reset:     1707753600 (Unix timestamp)

Our rate-limit.ts tracks these across all requests and exposes:
  { limit, remaining, resetAt, isAuthenticated }

UI reacts at thresholds:
  remaining > 20  →  subtle counter in header
  remaining ≤ 20  →  yellow warning + "Add token" link
  remaining ≤ 5   →  amber pulse
  remaining = 0   →  red banner + auto-expanded token input
```

### Ahead/Behind (the expensive part)

1 API call per fork. For 500 forks = 500 calls at 60/hr = 8+ hours without a token.

**Solution: lazy viewport loading.**

```typescript
// Only fetch ahead/behind for rows visible in the viewport
function useAheadBehind(forkOwner: string, forkBranch: string, isVisible: boolean) {
  return useQuery({
    queryKey: ["ahead-behind", forkOwner, forkBranch],
    queryFn: () => fetchComparison(parentRepo, forkOwner, forkBranch),
    enabled: isVisible,  // ← only fires when row is in viewport
    staleTime: 5 * 60 * 1000,
  });
}
```

Most users look at 25-50 forks. That's 25-50 API calls — well within the 60/hr unauthenticated limit.

---

## 8. Performance Strategy

| Technique | What it does | Where it's used |
|-----------|-------------|-----------------|
| **Lazy ahead/behind** | IntersectionObserver triggers fetch only for visible rows | `useAheadBehind` + `useIntersection` |
| **Parallel page fetch** | Fetch fork pages 2-N concurrently (max 5) | `useForks` |
| **Progressive rendering** | Show basic data immediately, enrich as API calls return | Fork table: stars/push first → ahead/behind → sparklines |
| **Stale-while-revalidate** | Show cached data instantly, refresh in background | All TanStack Query hooks |
| **Request deduplication** | Multiple components reading the same fork data don't cause duplicate requests | TanStack Query built-in |
| **Virtual scrolling** | For repos with 1,000+ forks, virtualize the table | `@tanstack/react-virtual` (add only if needed) |
| **Code splitting** | Lazy-load export module and sparkline chart code | `React.lazy()` + dynamic `import()` |
| **Debounced filters** | 300ms debounce on numeric filter inputs | `useDebouncedValue` in filter components |
| **Minimal bundle** | No Next.js, no heavy chart lib, shadcn components are tree-shaken | Architecture choices |

### Bundle Budget

| Chunk | Target | What's in it |
|-------|--------|-------------|
| **Initial** | < 80 KB gzip | React + Tailwind runtime + shadcn components + App shell |
| **TanStack** | < 30 KB gzip | React Query + React Table |
| **Lazy: Export** | < 5 KB gzip | CSV/JSON generation (loaded on click) |
| **Lazy: Sparkline** | < 3 KB gzip | SVG sparkline renderer (loaded on scroll) |
| **Total** | < 120 KB gzip | Well under our 150 KB PRD target |

---

## 9. URL State (No Router Needed)

Single page. No routes. URL search params are the routing:

```typescript
// useUrlState.ts — bidirectional sync between URL and React state
function useUrlState() {
  const params = new URLSearchParams(window.location.search);

  const state = {
    repo: params.get("repo") ?? "",
    sort: params.get("sort") ?? "relevance",
    order: params.get("order") ?? "desc",
    filter: params.get("filter") ?? "",
    page: Number(params.get("page") ?? 1),
    perPage: Number(params.get("per_page") ?? 25),
  };

  function update(changes: Partial<typeof state>) {
    const next = { ...state, ...changes };
    const nextParams = new URLSearchParams();
    if (next.repo) nextParams.set("repo", next.repo);
    if (next.sort !== "relevance") nextParams.set("sort", next.sort);
    if (next.order !== "desc") nextParams.set("order", next.order);
    if (next.filter) nextParams.set("filter", next.filter);
    if (next.page > 1) nextParams.set("page", String(next.page));
    if (next.perPage !== 25) nextParams.set("per_page", String(next.perPage));

    // replaceState — no back-button pollution
    window.history.replaceState(null, "", `?${nextParams}`);
  }

  return { state, update };
}
```

Default values are omitted from the URL for clean links:
- `?repo=facebook/react` (everything else at defaults)
- `?repo=facebook/react&sort=ahead&filter=ahead:gt:0` (non-default sort + filter)

---

## 10. Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - uses: actions/deploy-pages@v4
```

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run build
```

### Vite config for GitHub Pages

```typescript
// vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/github-forks/",  // ← repo name for GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

## 11. Security

| Concern | Mitigation |
|---------|------------|
| **GitHub token storage** | localStorage only. Never sent to any server except `api.github.com`. Scoped to `public_repo` (read-only). Clear button with confirmation |
| **XSS via repo names** | React auto-escapes JSX. No `dangerouslySetInnerHTML` anywhere. User input sanitized by `url-parser.ts` before use |
| **CORS** | GitHub API allows browser CORS natively. No proxy needed |
| **Supply chain** | Lock file committed. Dependabot alerts enabled. shadcn components are copy-pasted (no runtime dependency on shadcn npm package) |
| **CSP** | `<meta>` tag with strict Content-Security-Policy. Only allow `api.github.com` and `avatars.githubusercontent.com` as external origins |

---

## 12. Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3",
    "react-dom": "^18.3",
    "@tanstack/react-query": "^5",
    "@tanstack/react-table": "^8",
    "lucide-react": "^0.460",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "sonner": "^2"
  },
  "devDependencies": {
    "typescript": "^5.6",
    "vite": "^6",
    "@vitejs/plugin-react": "^4",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "^4",
    "tw-animate-css": "^1",
    "vitest": "^2",
    "@testing-library/react": "^16",
    "eslint": "^9",
    "prettier": "^3",
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

**Total runtime dependencies: 7** (React, React DOM, TanStack Query, TanStack Table, Lucide, clsx, tailwind-merge, sonner). Everything else is dev-only or copy-pasted shadcn components.

Radix UI primitives (used by shadcn components) are installed per-component by the `shadcn add` command — they're listed in package.json but are tree-shaken aggressively.
