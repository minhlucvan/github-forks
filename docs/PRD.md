# Product Requirements Document: Active Forks Rebuild

> **See also:** [USER-RESEARCH.md](./USER-RESEARCH.md) for deep user insights, personas, and competitive analysis.

## 1. Why This Exists

Every day, developers discover that a project they depend on is abandoned. GitHub's fork list is useless — hundreds of empty forks, no way to tell which ones have real work. They google "find active github forks" and land on [techgaun/active-forks](https://github.com/techgaun/active-forks), a beloved but stagnant tool with 2,400 stars and 31 open issues spanning 7 years.

The irony: **a tool for finding maintained forks of abandoned projects has itself become an abandoned project that needs a maintained fork.**

We're building that fork.

## 2. The Core Problem

Active-forks answers the wrong question. It answers *"When was each fork last pushed to?"* but users actually need *"Which fork has done the most useful independent work?"*

A fork pushed yesterday might just have a README typo. A fork not pushed in 6 months might be 200 commits ahead with critical bug fixes. The current tool can't tell the difference — and that's why the ahead/behind feature has been the #1 request for 7+ years with 40+ comments across issues #17, #30, #61, #66.

**We will bridge the gap between recency and relevance.**

## 3. Who We're Building For

| Segment | Need | What "done" looks like |
|---------|------|----------------------|
| **The Refugee** — depends on an abandoned project | Find the successor fork, fast | Searches repo → sees the clear winner in <5 seconds |
| **The Evaluator** — choosing between multiple forks | Compare forks by meaningful divergence | Sorts by "ahead" commits → sees which forks have real independent work |
| **The Mapper** — understanding a full fork ecosystem | See the complete fork network, including forks-of-forks | Expands fork tree → discovers a fork-of-a-fork with 300 commits the original list missed |
| **The Integrator** — wants this inside their GitHub workflow | Zero context-switching | Clicks bookmarklet on a GitHub page → instant results |

(Full personas, quotes, and evidence in [USER-RESEARCH.md](./USER-RESEARCH.md))

## 4. Design Principles

These come directly from user research, not from aesthetics:

| Principle | Why | How |
|-----------|-----|-----|
| **Zero friction first impression** | Users arrive frustrated from GitHub; they want answers, not setup | No token required to start. Paste URL → results in 3 seconds |
| **Relevance over recency** | "Last push" is unreliable and doesn't distinguish typo fixes from real work | Default sort weights ahead-commits + stars + recency together |
| **Progressive depth** | Refugees want a quick answer; Mappers want a deep analysis | Simple table first → reveal charts, trees, export on demand |
| **Respect the rate limit** | 60 req/hr unauthenticated kills the experience for large repos | Lazy-load enriched data. Show what we have. Clear rate limit UI |
| **Every state is a URL** | Users paste this tool in issue threads of abandoned repos | Sort, filter, page state all in URL. Copy-link button. OG tags |
| **Don't become what we replace** | The original abandoned itself after promising features "next weekend" for years | Modern stack, tests, CI/CD, welcoming contributor experience |

## 5. What We're Building

### 5.1 Must Ship (solves the core problem)

| # | What | Why (user need) | Evidence |
|---|------|-----------------|----------|
| 1 | **Fork search** — by `owner/repo` or pasted GitHub URL | Every user journey starts here | Existing feature; improve input parsing |
| 2 | **Ahead/behind commit counts** vs parent repo | The #1 user need: "Which forks have real work?" | Issues #17, #30, #61, #66 — 7 years of requests |
| 3 | **Smart default sort** — relevance score (ahead + stars + recency) | Current sort-by-stars is wrong; sort-by-push is also wrong | Issue #52; user research segment analysis |
| 4 | **All forks, not just 100** — paginated API fetching | Large repos hide the best forks beyond page 1 | Issue #13; React has 20K+ forks |
| 5 | **Parent repo context card** | Users need the baseline to evaluate forks against | Issue #21 |
| 6 | **GitHub token support** with clear rate limit display | Tool breaks without it for popular repos | Issue #55; API 403 frustrations |
| 7 | **Shareable URLs** with full state (sort, filter, page) | Users share this in GitHub issues of abandoned repos | How users discover us |
| 8 | **Dark/light/system theme** that actually looks good | Current dark mode just inverts colors; "looks so ugly" | Issue #79 |
| 9 | **Responsive design** — works on mobile | GitHub browsing happens on mobile too | Standard expectation |

### 5.2 Should Ship (deepens the value)

| # | What | Why (user need) | Evidence |
|---|------|-----------------|----------|
| 10 | **Commit activity sparklines** per fork | Visual "is this fork alive?" signal at a glance | Power users want patterns, not just numbers |
| 11 | **Fork health score** — composite badge | The Refugee just wants "which one is best?" in one number | Derived from user research: they want a recommendation |
| 12 | **Advanced filters** — by stars, push date, ahead count | Evaluators need to narrow 2,000 forks to 10 candidates | Standard table UX for large datasets |
| 13 | **Recursive fork tree** — forks of forks | The best successor is sometimes a fork-of-a-fork | Issue #31; MonitorControl.OSX example |
| 14 | **Export** — CSV and JSON | Evaluators need to share findings with their team | Issue #11; standard data tool feature |
| 15 | **Search history** — recent repos in localStorage | Users come back to re-check forks they looked at before | Reduce friction for repeat users |
| 16 | **Bookmarklet** — one-click from any GitHub page | Integrators don't want to copy-paste URLs | Existing feature; keep it |

### 5.3 Future (expand the platform)

| # | What | Why | Evidence |
|---|------|-----|----------|
| 17 | **Browser extension** — inline fork info on GitHub | Integrators want zero context-switching | Issues #29, #78; 3 community extensions exist |
| 18 | **Fork network graph** — visual tree of all forks | Mappers want to see the full picture | Power user request |
| 19 | **PWA + offline** | Cache results for repeat visits | Nice for mobile users |
| 20 | **GitLab / Gitea support** | Same problem exists on other platforms | Issue #27 |

### 5.4 Non-Goals (v1)

- Backend server or database — stays 100% client-side
- User accounts or persistent login
- Private repository support (needs OAuth scoping we want to avoid)
- Monetization

## 6. How We Win Against Alternatives

| What users try | Why they try it | Where it fails | How we win |
|----------------|----------------|----------------|------------|
| **active-forks (original)** | Zero friction, instant | No ahead/behind, 100 fork limit, abandoned | Same simplicity + ahead/behind + all forks |
| **Useful Forks** | Has ahead/behind data | Requires token, cluttered UI, no fork tree | Better UX, progressive token, recursive forks |
| **Lovely Forks** | Passive inline on GitHub | Only shows ONE fork, no comparison | More depth, same zero-friction ethos |
| **GitHub native forks** | Built-in, no tool needed | No ahead/behind, caps at 2,500, basic sort | The depth GitHub refuses to build |
| **Manual browsing** | Desperation | Incredibly slow for >10 forks | Automate the entire workflow |

**Our position: "Understand the fork landscape in seconds. Go deep when you need to."**

## 7. Success Metrics

### Product Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Time from paste to results | < 3 seconds (for repos with ≤100 forks) | Zero-friction principle |
| Users who click a fork link | > 60% of searches | They found what they needed |
| Users who add a token | > 15% of sessions with rate limit hit | Token UX is clear enough |
| Return visitors (weekly) | > 20% | Tool is useful enough to come back |

### Technical Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Lighthouse Performance | > 90 | Fast first impression |
| Lighthouse Accessibility | > 95 | WCAG 2.1 AA compliance |
| First Contentful Paint | < 1.5s | Perceived speed |
| Bundle size (gzipped) | < 150 KB | Client-side app must be lean |
| Test coverage | > 80% | Don't become what we replace |

## 8. Technical Constraints

- **Client-side only** — no backend; all API calls from the browser
- **GitHub API rate limits** — 60/hr unauthenticated, 5,000/hr with token
- **CORS** — GitHub API supports browser CORS natively
- **Static hosting** — deploy to GitHub Pages (or Vercel/Netlify)
- **Ahead/behind is expensive** — 1 API call per fork; must be lazy-loaded

## 9. Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| Q1 | Should the "relevance score" formula be user-configurable? | Affects sort UX complexity | Open |
| Q2 | At what fork count do we warn about load time? (500? 1000?) | Affects UX for large repos | Open |
| Q3 | REST-only or hybrid REST+GraphQL? | GraphQL could reduce calls but requires token | Open |
| Q4 | Should we show GitHub's "fork is X commits behind" banner data? | Free data from the fork page itself | Needs research |

## 10. References

- User research: [USER-RESEARCH.md](./USER-RESEARCH.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Feature specs: [FEATURES.md](./FEATURES.md)
- UI/UX design: [UI-UX.md](./UI-UX.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)
- Original project: [techgaun/active-forks](https://github.com/techgaun/active-forks)
- Top competitor: [useful-forks.github.io](https://useful-forks.github.io/)
- Key issues: [#17](https://github.com/techgaun/active-forks/issues/17) (ahead/behind), [#13](https://github.com/techgaun/active-forks/issues/13) (pagination), [#31](https://github.com/techgaun/active-forks/issues/31) (recursive forks)
