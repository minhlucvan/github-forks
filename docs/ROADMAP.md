# Implementation Roadmap

## Phase Overview

```
Phase 1: Foundation          ██████████████░░░░░░░░░░░░░░░░  Core app, table, search
Phase 2: Enrichment          ░░░░░░░░░░░░░░██████████░░░░░░  Ahead/behind, activity, score
Phase 3: Power Features      ░░░░░░░░░░░░░░░░░░░░░░░░██████  Export, recursive, visualization
Phase 4: Polish & Extensions ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  PWA, extension, GitLab
```

---

## Phase 1: Foundation

**Goal:** Feature parity with the original active-forks, on a modern stack.

### Tasks

| # | Task | Details |
|---|------|---------|
| 1.1 | **Project scaffolding** | Vite + React + TypeScript + Tailwind CSS setup |
| 1.2 | **GitHub API client** | REST client with token support, rate limit tracking, error handling |
| 1.3 | **Search component** | Input parsing, URL normalization, search submission |
| 1.4 | **Fork table** | TanStack Table with sorting, pagination, responsive layout |
| 1.5 | **Parent repo card** | Display source repository metadata above table |
| 1.6 | **Theme system** | Light/dark/system toggle with Tailwind dark mode |
| 1.7 | **URL routing** | Query parameter-based state (repo, sort, page) |
| 1.8 | **All-forks pagination** | Fetch beyond 100 forks with parallel page requests |
| 1.9 | **Error handling** | User-friendly error states for all API failure modes |
| 1.10 | **CI/CD pipeline** | GitHub Actions for lint, test, build, deploy |
| 1.11 | **Core tests** | Unit tests for API client, utils, and key components |

### Deliverables
- Deployed app on GitHub Pages with full fork listing
- Responsive table with sort, filter, paginate
- Dark mode, shareable URLs, token support
- CI pipeline running on every PR

---

## Phase 2: Enrichment

**Goal:** Deliver the most-requested community features.

### Tasks

| # | Task | Details |
|---|------|---------|
| 2.1 | **Ahead/behind comparison** | REST compare endpoint, lazy-loaded per visible row |
| 2.2 | **Commit activity sparklines** | Fetch commit_activity stats, render inline SVG charts |
| 2.3 | **Fork health score** | Composite scoring algorithm, colored badge display |
| 2.4 | **Search history** | localStorage-backed recent searches with dropdown |
| 2.5 | **Advanced filters** | Filter by stars, push date, ahead count, health score |
| 2.6 | **Token management UI** | Expandable token input with validation and rate limit display |
| 2.7 | **Column customization** | Toggle column visibility, persist preferences |
| 2.8 | **Bookmarklet** | JavaScript bookmarklet for quick access from GitHub pages |
| 2.9 | **Integration tests** | End-to-end tests for search flow, filtering, theme switching |

### Deliverables
- Ahead/behind data for every fork
- Visual commit activity indicators
- Health scoring system
- Full filter and column customization

---

## Phase 3: Power Features

**Goal:** Advanced capabilities for power users and data analysis.

### Tasks

| # | Task | Details |
|---|------|---------|
| 3.1 | **Export to CSV/JSON** | Download filtered results in multiple formats |
| 3.2 | **Recursive fork tree** | Discover and display forks-of-forks with expandable tree |
| 3.3 | **Fork comparison** | Select two forks and view side-by-side diff summary |
| 3.4 | **Keyboard shortcuts** | Vim-style navigation, search focus, theme toggle |
| 3.5 | **Virtual scrolling** | TanStack Virtual for repos with 1000+ forks |
| 3.6 | **Social sharing** | Copy link button, Open Graph meta tags for previews |
| 3.7 | **Performance audit** | Lighthouse optimization pass, bundle analysis |

### Deliverables
- Export functionality
- Recursive fork discovery
- Keyboard-driven power user experience
- Performance optimized for large datasets

---

## Phase 4: Polish & Extensions (Future)

**Goal:** Expand beyond the core web app.

### Tasks

| # | Task | Details |
|---|------|---------|
| 4.1 | **PWA support** | Service worker, offline caching, installable |
| 4.2 | **Browser extension** | Chrome/Firefox extension for inline GitHub integration |
| 4.3 | **GitLab support** | Extend API client for GitLab repositories |
| 4.4 | **Fork network graph** | D3.js or similar visualization of fork relationships |
| 4.5 | **GraphQL migration** | Migrate to GitHub GraphQL API for richer, fewer requests |
| 4.6 | **i18n** | Internationalization support for top languages |

### Deliverables
- Installable PWA
- Browser extension MVP
- Multi-platform support

---

## Open Issues Addressed

This roadmap directly addresses the following open issues from the original [techgaun/active-forks](https://github.com/techgaun/active-forks/issues):

| Issue | Title | Phase |
|-------|-------|-------|
| #13 | Fetch more than 30 forks | Phase 1 (F4) |
| #17 | Commits behind/ahead/identical | Phase 2 (F3) |
| #19 | GitHub API v4 GraphQL | Phase 4 (4.5) |
| #21 | Show the main repository as well | Phase 1 (F11) |
| #24 | Humanize size column | Phase 1 (F2) |
| #25 | Show creation date | Phase 1 (F2) |
| #27 | Integrate with GitLab | Phase 4 (4.3) |
| #29 | Browser extension | Phase 4 (4.2) |
| #31 | Include recursive forks | Phase 3 (F10) |
| #43 | Show most recent release | Phase 2 |
| #48 | Allow forks of gists | Phase 4 |
| #55 | 403 error (rate limiting) | Phase 1 (F7) |
| #61 | Ahead/even/behind vs original | Phase 2 (F3) |
| #63 | Show if issues are enabled | Phase 1 (F2) |
| #66 | Commits ahead from original | Phase 2 (F3) |
| #69 | Show/filter README changes | Phase 3 |
| #70 | Filter "forked from" owner | Phase 2 (F5) |
| #71 | Fails to show updated fork | Phase 1 (bug fix) |
| #78 | Chrome Extension | Phase 4 (4.2) |

---

## Technical Milestones

```
M1: Project setup compiles and deploys          → End of Phase 1.1-1.2
M2: Fork search and table rendering works       → End of Phase 1.4
M3: Feature parity with original active-forks   → End of Phase 1
M4: Ahead/behind data visible in table          → End of Phase 2.1
M5: Full Phase 2 features deployed              → End of Phase 2
M6: Export and recursive forks working           → End of Phase 3
M7: PWA and extension MVP                       → End of Phase 4
```
