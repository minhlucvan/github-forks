# Product Requirements Document: Active Forks Rebuild

## 1. Overview

**Project:** github-forks (Active Forks Rebuild)
**Original Project:** [techgaun/active-forks](https://github.com/techgaun/active-forks) (2,397 stars, 309 forks)
**Status:** New build from scratch
**License:** MIT

## 2. Problem Statement

The original [active-forks](https://techgaun.github.io/active-forks/) is a widely-used tool that helps developers find the most active forks of a GitHub repository. Despite its popularity, the project suffers from:

1. **Unmaintained status** -- the original author is actively seeking new maintainers
2. **No build system** -- vanilla JS with all dependencies loaded from CDNs, no testing, no CI/CD
3. **Limited data** -- fetches max 100 forks, no ahead/behind comparison, no commit activity insights
4. **Outdated UI** -- basic Bootstrap card layout, minimal interactivity, no data visualization
5. **31 open issues** spanning 7 years of unaddressed feature requests and bugs
6. **REST API v3 only** -- inefficient data fetching, missing fields available through GraphQL

## 3. Goals

| Goal | Description |
|------|-------------|
| **G1** | Build a modern, performant replacement with a proper frontend framework and build pipeline |
| **G2** | Solve the top community-requested features (ahead/behind, recursive forks, pagination) |
| **G3** | Deliver a polished, responsive UI with data visualizations and modern UX patterns |
| **G4** | Provide extensibility for future features (browser extension, GitLab support) |
| **G5** | Establish a maintainable codebase with testing, CI/CD, and clear contribution guidelines |

## 4. Non-Goals (v1)

- Browser extension (deferred to v2)
- GitLab/Gitea/Codeberg support (deferred to v2)
- Backend server or database -- stays client-side only
- User accounts or authentication (beyond optional GitHub token)
- Monetization

## 5. Target Users

| Persona | Description |
|---------|-------------|
| **Open Source Maintainer** | Wants to find active forks of abandoned projects to identify successors or collaborators |
| **Developer** | Looking for forks with specific fixes, features, or continued development |
| **Researcher** | Analyzing fork activity patterns across repositories |
| **Community Manager** | Tracking ecosystem health and fork divergence for popular projects |

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| First Contentful Paint | < 1.5s |
| Time to fetch & render 100 forks | < 3s |
| Bundle size (gzipped) | < 150 KB |
| Test coverage | > 80% |

## 7. Competitive Analysis

| Feature | active-forks (original) | Useful Forks | GitPop3 | **github-forks (ours)** |
|---------|------------------------|--------------|---------|------------------------|
| Fork listing | Yes | Yes | No | Yes |
| Sort by stars/forks/date | Yes | Yes | Yes | Yes |
| Ahead/behind parent | No | Partial | No | **Yes** |
| Recursive forks | No | No | No | **Yes** |
| Commit activity chart | No | No | No | **Yes** |
| Dark mode | Yes | No | No | Yes |
| Advanced filters | Basic | No | No | **Yes** |
| Shareable URLs | Hash-based | No | Yes | **Yes** |
| GitHub token support | No | No | No | **Yes** |
| Pagination (>100 forks) | No | No | No | **Yes** |
| Modern framework | No | No | No | **Yes** |
| Offline/PWA | No | No | No | **Yes** |

## 8. High-Level Requirements

### 8.1 Core Features (Must Have)

| ID | Feature | Priority |
|----|---------|----------|
| F1 | Search forks by `owner/repo` or full GitHub URL | P0 |
| F2 | Display fork table with sorting, filtering, and pagination | P0 |
| F3 | Show ahead/behind commit counts vs parent repo | P0 |
| F4 | Fetch all forks with pagination (not limited to 100) | P0 |
| F5 | Dark/light theme with system preference detection | P0 |
| F6 | Shareable URLs with query parameters | P0 |
| F7 | Optional GitHub token input for higher rate limits | P0 |
| F8 | Responsive design (mobile, tablet, desktop) | P0 |

### 8.2 Enhanced Features (Should Have)

| ID | Feature | Priority |
|----|---------|----------|
| F9 | Commit activity sparkline/chart per fork | P1 |
| F10 | Recursive fork tree (forks of forks) | P1 |
| F11 | Show parent repository details and comparison | P1 |
| F12 | Export results (CSV, JSON) | P1 |
| F13 | Bookmarklet for quick access from GitHub | P1 |
| F14 | Fork health score (composite metric) | P1 |
| F15 | Recently searched repositories (local history) | P1 |

### 8.3 Nice to Have

| ID | Feature | Priority |
|----|---------|----------|
| F16 | PWA support with offline caching | P2 |
| F17 | Fork network visualization (graph) | P2 |
| F18 | Social sharing (copy link, share to X/Twitter) | P2 |
| F19 | Keyboard shortcuts for power users | P2 |
| F20 | Compare two forks side-by-side | P2 |

## 9. Technical Constraints

- **Client-side only** -- no backend server; all API calls from browser
- **GitHub API rate limits** -- 60 req/hr unauthenticated, 5,000 req/hr with token
- **CORS** -- GitHub API supports CORS for browser requests
- **Static hosting** -- must deploy to GitHub Pages or similar CDN
- **Bundle size** -- keep total JS bundle under 150 KB gzipped

## 10. Open Questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Should we use GitHub GraphQL API exclusively or hybrid REST+GraphQL? | Open |
| Q2 | Should fork health score be configurable by users? | Open |
| Q3 | What's the threshold for "too many forks" before we warn users about load time? | Open |
| Q4 | Should we support private repos (requires auth)? | Open |

## 11. References

- Original project: https://github.com/techgaun/active-forks
- GitHub REST API: https://docs.github.com/en/rest
- GitHub GraphQL API: https://docs.github.com/en/graphql
- Community feature requests: Issues #17, #31, #61, #66, #78 on techgaun/active-forks
