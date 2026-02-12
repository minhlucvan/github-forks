# Architecture: Active Forks Rebuild

## 1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 18+ with TypeScript | Component-based, large ecosystem, strong typing |
| **Build Tool** | Vite | Fast HMR, optimized builds, excellent DX |
| **Styling** | Tailwind CSS | Utility-first, small bundle, easy theming |
| **State Management** | TanStack Query (React Query) | Caching, pagination, background refetch for API calls |
| **Table** | TanStack Table | Headless, fully typed, sorting/filtering/pagination built-in |
| **Charts** | Recharts or lightweight sparkline lib | Commit activity visualization |
| **Routing** | React Router (hash mode) | Deep linking, GitHub Pages compatible |
| **Testing** | Vitest + Testing Library | Fast unit/integration tests, Vite-native |
| **Linting** | ESLint + Prettier | Code quality and consistency |
| **CI/CD** | GitHub Actions | Automated testing, build, and deployment |
| **Hosting** | GitHub Pages | Free, static, custom domain support |

## 2. Project Structure

```
github-forks/
├── docs/                          # Project documentation (PRD, architecture, etc.)
├── public/
│   ├── favicon.svg
│   └── og-image.png               # Social sharing preview
├── src/
│   ├── api/
│   │   ├── github.ts              # GitHub API client (REST + GraphQL)
│   │   ├── types.ts               # API response types
│   │   └── rate-limit.ts          # Rate limit tracking and display
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx       # Repo input with URL parsing
│   │   │   ├── SearchHistory.tsx   # Recent searches dropdown
│   │   │   └── TokenInput.tsx      # GitHub token configuration
│   │   ├── forks/
│   │   │   ├── ForkTable.tsx       # Main data table
│   │   │   ├── ForkRow.tsx         # Individual fork row
│   │   │   ├── ForkFilters.tsx     # Advanced filter controls
│   │   │   ├── ForkStats.tsx       # Summary statistics bar
│   │   │   ├── AheadBehind.tsx     # Ahead/behind badge component
│   │   │   └── ActivityChart.tsx   # Commit activity sparkline
│   │   ├── repo/
│   │   │   ├── RepoCard.tsx        # Parent repository info card
│   │   │   └── ForkTree.tsx        # Recursive fork visualization
│   │   ├── export/
│   │   │   └── ExportMenu.tsx      # CSV/JSON export controls
│   │   └── ui/
│   │       ├── ThemeToggle.tsx     # Dark/light mode switch
│   │       ├── Spinner.tsx
│   │       ├── Badge.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useForks.ts            # Fork data fetching with pagination
│   │   ├── useRepo.ts             # Parent repo data
│   │   ├── useAheadBehind.ts      # Commit comparison queries
│   │   ├── useTheme.ts            # Theme state management
│   │   ├── useSearchHistory.ts    # Local storage search history
│   │   └── useGitHubToken.ts      # Token storage and validation
│   ├── lib/
│   │   ├── constants.ts           # API URLs, defaults, limits
│   │   ├── utils.ts               # Date formatting, size humanizing, URL parsing
│   │   ├── fork-score.ts          # Fork health score algorithm
│   │   └── export.ts              # CSV/JSON generation utilities
│   ├── App.tsx                    # Root component with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind directives + custom styles
├── tests/
│   ├── api/
│   │   └── github.test.ts
│   ├── components/
│   │   ├── SearchBar.test.tsx
│   │   └── ForkTable.test.tsx
│   ├── hooks/
│   │   └── useForks.test.ts
│   └── lib/
│       ├── utils.test.ts
│       └── fork-score.test.ts
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Test + lint on PR
│       └── deploy.yml             # Build + deploy to GitHub Pages
├── index.html                     # Vite entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
└── README.md
```

## 3. Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  SearchBar   │────>│  React Query │────>│  GitHub API      │
│  (user input)│     │  (cache +    │     │  REST / GraphQL  │
└─────────────┘     │   pagination)│     └─────────────────┘
                     └──────┬───────┘              │
                            │                      │
                     ┌──────▼───────┐     ┌───────▼────────┐
                     │  Fork State  │<────│  API Response   │
                     │  (sorted,    │     │  (normalized)   │
                     │   filtered)  │     └────────────────┘
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐
       │  ForkTable   │ │ Stats  │ │  RepoCard   │
       │  (TanStack)  │ │ Bar    │ │  (parent)   │
       └─────────────┘ └────────┘ └─────────────┘
```

## 4. API Strategy

### 4.1 Hybrid REST + GraphQL

Use REST API for simple fork listing (well-cached, straightforward) and GraphQL for enriched data (ahead/behind counts, commit activity):

```
Phase 1: REST /repos/{owner}/{repo}/forks?per_page=100&page={n}
  → Fork list with basic metadata (stars, forks, issues, size, pushed_at)

Phase 2: GraphQL (on-demand, per visible fork)
  → Ahead/behind counts via `compare` or `ref` queries
  → Recent commit activity
```

### 4.2 Pagination Strategy

```typescript
// Fetch all pages concurrently after getting the first page
// First page tells us total count via Link header
const firstPage = await fetchForks(repo, { page: 1, per_page: 100 });
const totalPages = parseLinkHeader(firstPage.headers.link);

// Fetch remaining pages in parallel (max 5 concurrent)
const remainingPages = await Promise.all(
  range(2, totalPages + 1).map(page =>
    fetchForks(repo, { page, per_page: 100 })
  )
);
```

### 4.3 Rate Limit Management

- Display remaining rate limit in the UI header
- Auto-detect when token is needed (> 60 requests required)
- Warn before starting a fetch that would exceed limits
- Queue and throttle requests when approaching limits

## 5. State Management

```
┌─────────────────────────────────────────────┐
│                TanStack Query               │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ repo query   │  │ forks query          │  │
│  │ (stale: 5m)  │  │ (stale: 5m,          │  │
│  │              │  │  paginated,           │  │
│  │              │  │  infinite scroll opt) │  │
│  └─────────────┘  └──────────────────────┘  │
│  ┌─────────────────────────────────────┐    │
│  │ ahead/behind queries (per fork,     │    │
│  │  lazy-loaded on scroll into view)   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              Local State (React)            │
│  - Sort column + direction                  │
│  - Active filters                           │
│  - Table page index                         │
│  - Search input value                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          localStorage (persistent)          │
│  - Theme preference                         │
│  - GitHub token (encrypted)                 │
│  - Search history (last 20)                 │
│  - Table column preferences                 │
└─────────────────────────────────────────────┘
```

## 6. Performance Strategy

| Technique | Description |
|-----------|-------------|
| **Lazy ahead/behind** | Only fetch comparison data for visible rows (IntersectionObserver) |
| **Request deduplication** | TanStack Query prevents duplicate in-flight requests |
| **Virtual scrolling** | For repos with 1000+ forks, use @tanstack/virtual |
| **Code splitting** | Lazy-load chart library and export module |
| **Stale-while-revalidate** | Show cached data immediately, refresh in background |
| **Concurrent fetching** | Fetch fork pages in parallel (throttled to 5 concurrent) |
| **Debounced search** | 300ms debounce on search input |

## 7. Theming

Use Tailwind's built-in dark mode with CSS custom properties:

```
- System preference detection via `prefers-color-scheme`
- Manual override stored in localStorage
- Three-state toggle: Light / Dark / System
- Smooth transitions on theme change
```

## 8. Deployment

```
GitHub Actions Pipeline:
  1. On push to main:
     - Install dependencies
     - Run linter (ESLint)
     - Run tests (Vitest)
     - Build (Vite)
     - Deploy to GitHub Pages

  2. On pull request:
     - Install dependencies
     - Run linter
     - Run tests
     - Build (verify no errors)
     - Preview deployment (optional)
```

## 9. Security Considerations

| Concern | Mitigation |
|---------|------------|
| GitHub token exposure | Store in localStorage (client-side only), never transmit to third parties, clear on logout |
| XSS via repo names | React auto-escapes JSX, sanitize any `dangerouslySetInnerHTML` usage |
| CORS | GitHub API allows browser CORS; no proxy needed |
| Dependency supply chain | Lock file, Dependabot alerts, minimal dependencies |
| Content Security Policy | Strict CSP headers via meta tag |
