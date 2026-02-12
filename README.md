# Active Forks

Find the most active fork of any GitHub repository.

Paste a repo URL, get a ranked table of forks sorted by health score — ahead/behind counts, stars, recent activity, and open issues. No sign-up required.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and paste a GitHub repo URL like `facebook/react`.

## How It Works

1. **Search** — Paste a GitHub URL or type `owner/repo`
2. **Scan** — Fetches all forks via the GitHub REST API (paginated, parallel)
3. **Score** — Each fork gets a health score: `ahead × 0.4 + stars × 0.25 + recency × 0.2 + issues × 0.15`
4. **Sort** — Table ranks forks by score. Click any column header to re-sort
5. **Filter** — Filter by owner name, language, health tier, or minimum stars
6. **Export** — Download results as CSV or JSON

### Health Score Tiers

| Tier | Score | Meaning |
|------|-------|---------|
| Thriving | 80+ | Actively maintained, many commits ahead |
| Active | 60–79 | Regular updates, community interest |
| Moderate | 40–59 | Some activity, not abandoned |
| Low | 20–39 | Minimal recent activity |
| Inactive | < 20 | Likely abandoned |

## Features

- **Ahead/behind badges** — See exactly how each fork diverges from the parent
- **Activity sparklines** — 12-week commit activity at a glance
- **Dark mode** — GitHub-inspired dark theme that feels like home
- **Rate limit aware** — Shows remaining API calls, prompts for a token when needed
- **Paste to search** — Paste a GitHub URL and it auto-submits
- **Search history** — Recent searches persisted in localStorage
- **Zero auth required** — Works without a GitHub token (60 requests/hour). Add a token for 5,000/hour

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| Data Table | TanStack Table |
| Server State | TanStack Query |
| Icons | Lucide React |

No backend. No database. 100% client-side — the GitHub API is the only data source.

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # shadcn/ui primitives (table, card, badge, button, etc.)
│   ├── search-bar.tsx   # Repo input with URL parsing + paste detection
│   ├── repo-card.tsx    # Parent repository info card
│   ├── fork-table.tsx   # TanStack Table + sorting + pagination
│   ├── fork-columns.tsx # Column definitions with cell renderers
│   ├── fork-toolbar.tsx # Filter toggle + fork count + export
│   ├── fork-filters.tsx # Owner search, language, health tier, min stars
│   ├── ahead-behind-badge.tsx   # +N / -N divergence pills
│   ├── health-score-badge.tsx   # Color-coded score with tooltip breakdown
│   ├── activity-sparkline.tsx   # Inline SVG commit sparkline
│   ├── rate-limit-indicator.tsx # API rate limit display + token input
│   ├── search-history.tsx       # Recent searches popover
│   ├── export-menu.tsx          # CSV/JSON export dropdown
│   └── empty-state.tsx          # Landing, no-forks, no-results, error
├── hooks/               # React hooks (all implemented)
│   ├── use-forks.ts     # Fetch all forks with pagination
│   ├── use-repo.ts      # Fetch parent repo metadata
│   ├── use-ahead-behind.ts    # Per-fork comparison (lazy)
│   ├── use-commit-activity.ts # Per-fork sparkline data (lazy)
│   ├── use-github-token.ts    # localStorage token management
│   ├── use-search-history.ts  # Recent searches
│   ├── use-url-state.ts       # URL search params ↔ React state
│   └── use-intersection.ts    # IntersectionObserver for lazy loading
├── lib/                 # Business logic
│   ├── github.ts        # API client with rate limit tracking
│   ├── fork-score.ts    # Health scoring algorithm
│   ├── relevance-sort.ts # Default sort implementation
│   ├── url-parser.ts    # Parse GitHub URLs to owner/repo
│   ├── export.ts        # CSV/JSON generation + download
│   ├── format.ts        # Number, date, size formatting
│   ├── rate-limit.ts    # Rate limit pub/sub tracking
│   └── constants.ts     # API URLs, thresholds, defaults
├── App.tsx              # Root layout + data orchestration
└── index.css            # Design tokens (light + dark mode)
```

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Type-check + production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run format    # Prettier
npm run test      # Vitest
```

## GitHub Token (Optional)

Without a token: 60 API requests/hour.
With a token: 5,000 API requests/hour.

Click the shield icon in the header to add a personal access token. No scopes needed for public repos. The token is stored in localStorage and only sent to `api.github.com`.

## License

MIT
