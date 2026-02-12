# Competitive Strategy: How to Win Against techgaun/active-forks

> Based on analysis of [USER-RESEARCH.md](./USER-RESEARCH.md), competitor issue trackers, HN discussions, and the competitive landscape.

---

## TL;DR

techgaun/active-forks has **2,400 stars, 309 forks, 29 open issues, and a maintainer who has publicly asked for a replacement.** It's the #1 Google result for "active github forks" — but it hasn't shipped a meaningful feature in years. Users have been begging for ahead/behind counts since **2018**. We already have it. The battle isn't feature parity — it's **discovery, trust, and the 5-second first impression.**

---

## Part 1: Why Users Stay With the Original (Despite Its Flaws)

Before we can win, we need to understand the inertia:

| Retention Force | Strength | How to Break It |
|----------------|----------|-----------------|
| **First Google result** for "active github forks" | Very high | SEO + content marketing (see Section 4) |
| **Linked in thousands of GitHub issues** | High | Can't undo — but we can create new links |
| **"Good enough" for simple repos** | Medium | Most repos have <100 forks; the original works fine for them |
| **Zero switching cost** | Actually helps us | If switching costs nothing, we just need to be found |
| **Brand recognition** — the name "active-forks" | Medium | We keep the name; we ARE the maintained fork |

**Key insight:** The original's moat is **distribution, not product**. Its product is weak. If we solve distribution, we win on product immediately.

---

## Part 2: Where the Original Fails (Our Attack Surface)

### Critical Failures (things that make users leave)

#### 1. No ahead/behind — the 7-year gap
- **Evidence:** Issues #17 (22 comments), PR #30 (17 comments), #61, #66
- **Impact:** THE reason users switch to Useful Forks or lukaszmn's fork
- **Our status:** Implemented. Lazy-loaded, lazy-cached, with visual badges
- **Action:** Make this the hero of every screenshot, demo, and README

#### 2. Only 100 forks shown
- **Evidence:** Issue #13, open since 2018, 10 comments
- **Impact:** For React (20K+ forks), Linux, or any popular repo, you see <1%
- **Our status:** Implemented. Parallel pagination fetches ALL forks
- **Action:** Show a "Showing 2,847 of 2,847 forks" counter prominently — the original can't

#### 3. Wrong default sort
- **Evidence:** Issue #52 — sorts by stars, not activity
- **Impact:** The first thing users see is wrong — stars measure historical popularity, not current health
- **Our status:** Implemented. Composite relevance score (ahead 40%, stars 25%, recency 20%, issues 15%)
- **Action:** Show the health score badge visually — a color-coded "Thriving / Active / Moderate / Low / Inactive" that the original has nothing comparable to

#### 4. Inaccurate "Last Push" date
- **Evidence:** Issue #32 — "The 'last push' column is always inaccurate"
- **Impact:** The primary sorting signal is broken
- **Our status:** We use last push as ONE of four inputs, not the sole signal

#### 5. API rate limiting destroys the experience
- **Evidence:** Issue #30, #55 — 403 errors with no guidance
- **Impact:** Tool becomes unusable for popular repos, exactly when you need it most
- **Our status:** Progressive token UX with clear rate limit display and one-click token setup

#### 6. The tool itself is abandoned
- **Evidence:** Issues #80, #92 — maintainer says "next weekend" for 7 years
- **Impact:** The meta-irony: a tool for finding maintained forks of abandoned projects IS an abandoned project
- **Our status:** Modern stack, active development, tests, CI

### Secondary Failures (things that annoy but don't make users leave)

| Issue | Original | Us |
|-------|----------|-----|
| Dark mode is "just inverted colors" (#79) | Ugly inversion | GitHub-inspired OKLCH dark palette |
| No fork-of-fork support (#31) | Not possible | Planned (recursive tree) |
| No export (#11) | Not available | CSV + JSON download |
| No mobile support | Broken on mobile | Responsive from day one |
| No search history | None | localStorage-based recent searches |

---

## Part 3: What Makes Users Switch (The Trigger Moments)

Users don't comparison-shop fork analysis tools. They switch when they hit a wall:

### Trigger 1: "I can't tell which fork has real work"
- They search a repo, see 50 forks sorted by stars, and realize stars don't tell them anything about independent development
- **Our answer:** Ahead/behind badges + health score + sparklines visible immediately

### Trigger 2: "The fork I need isn't in the first 100"
- They search a popular repo, notice only 100 results, and know the best fork could be #347
- **Our answer:** "Showing 2,847 of 2,847 forks" with full pagination

### Trigger 3: "I hit a rate limit and there's no guidance"
- They get a 403 and the tool just stops working
- **Our answer:** Progressive rate limit display → clear token setup flow → instant recovery

### Trigger 4: "This tool looks like it's from 2017"
- The original's UI is a basic Bootstrap table with no visual refinement
- **Our answer:** Modern UI with shadcn/ui, proper dark mode, activity sparklines, health badges

---

## Part 4: The Playbook — 10 Concrete Actions to Win

### Action 1: Win the README battle

The README is the landing page. When someone finds us on GitHub, the README must answer in 5 seconds: **"Why this instead of the original?"**

**Structure:**
```
# Active Forks (Maintained)

> The original active-forks, rebuilt with the features users have requested for 7 years.

[screenshot comparing old vs new — side by side]

## What's Different

| Feature | Original | This Fork |
|---------|----------|-----------|
| Ahead/behind commits | No | Yes |
| All forks (not just 100) | No | Yes |
| Health score | No | Yes |
| Activity sparklines | No | Yes |
| Smart relevance sort | No | Yes |
| Modern dark mode | Inverted colors | GitHub-inspired |
| Export (CSV/JSON) | No | Yes |
| Rate limit UX | 403 error | Progressive guidance |

[Live demo →]
```

**Why:** Every GitHub visitor makes a stay/leave decision based on the README. A comparison table is devastatingly effective against a stagnant competitor.

---

### Action 2: Claim the "maintained fork" narrative

The original maintainer has **publicly asked for a replacement** (Issue #80, #92). This is rare — most abandoned projects just go silent. We have implicit permission to be the successor.

**Actions:**
- Post a respectful comment on techgaun/active-forks Issue #80 ("Looking for maintainer"): "We've rebuilt this with ahead/behind, full pagination, and a modern UI at [link]. Happy to be the recommended successor."
- Post on Issue #17 (ahead/behind — the 7-year request): "This is now available at [link]."
- Post on Issue #13 (pagination): "Full fork pagination is now available at [link]."
- Keep the tone **grateful**, not competitive: "Built on the original's foundation."

**Why:** The original's issue tracker is where frustrated users land. Every comment is a redirect to us.

---

### Action 3: Nail SEO for "active github forks"

The original ranks #1 for:
- "active github forks"
- "find active forks github"
- "github abandoned project find fork"
- "most active fork github"

**Actions:**
- **Deploy to a memorable URL:** `active-forks.dev` or `forkfinder.dev` (or use GitHub Pages with a custom domain)
- **Title tag:** "Active Forks — Find the Best Maintained Fork of Any GitHub Repo"
- **Meta description:** "See ahead/behind commits, health scores, and activity sparklines for every fork. The tool GitHub should have built."
- **Open Graph tags:** Rich preview with screenshot when shared on HN, Twitter, Reddit
- **Structured data:** FAQ schema targeting "how to find active github forks"
- **Create a `/about` or landing section** with SEO-optimized text explaining the problem and solution

**Why:** 40%+ of users discover the original through Google. Ranking alongside or above it is the single highest-leverage growth action.

---

### Action 4: Launch on Hacker News strategically

The original resurfaces on HN every 1-2 years. HN users are power users who value depth.

**Launch post title:** "Show HN: Active Forks – Find which GitHub forks have real independent work (ahead/behind, health scores)"

**Key points for the HN audience:**
- "The original active-forks shows when a fork was pushed. We show what it actually did."
- "Ahead/behind commits — the #1 requested feature for 7 years — is now default"
- "Works without a token. Fetches ALL forks, not just 100."
- "Client-side only. No backend. No tracking. No sign-up."

**Timing:** Launch when there's a high-profile project abandonment in the news (happens regularly).

**Why:** A single HN front page appearance can generate 10K+ visits and hundreds of GitHub stars in 24 hours.

---

### Action 5: Create the "aha moment" in under 5 seconds

Users arrive frustrated from GitHub's useless fork page. The first 5 seconds must deliver value.

**The flow:**
1. User pastes URL (or types owner/repo)
2. Results appear in <3 seconds
3. The FIRST thing they see: health score badges + ahead/behind counts
4. Their reaction: "Oh, THIS fork is 142 commits ahead and thriving. That's my answer."

**What the original shows:** A plain table with stars and last push date. No insight.
**What we show:** Color-coded health badges, ahead/behind pills, activity sparklines — an instant visual answer.

**Specific UI investments for the "aha moment":**
- The top-ranked fork should visually stand out (subtle highlight or "top pick" indicator)
- Ahead/behind should use color: green for ahead, amber for behind — not just numbers
- Health score tier ("Thriving") should be immediately readable without hovering

---

### Action 6: Make sharing frictionless (viral loop)

Users discover the original by seeing it linked in GitHub issues. We need the same viral loop — but better.

**Actions:**
- **Copy-link button** that copies the full URL with state (sort, filters, page)
- **Open Graph meta tags** so shared links show a rich preview (repo name, fork count, top fork)
- **"Share these results" CTA** after a search completes
- **Deep links that work:** `?repo=facebook/react&sort=ahead&filter=ahead:gt:0` should restore the exact view

**The viral loop:**
1. User A finds us, searches for `abandoned-lib`
2. Finds the successor fork
3. Posts in `abandoned-lib` Issue #xyz: "Found the maintained fork using [our-link]"
4. User B clicks the link → sees instant results → repeats

**Why:** Each shared link is free distribution. The original benefits from this already — we need to surpass it with better link previews and stateful URLs.

---

### Action 7: Build the comparison page nobody else has

Create a dedicated page/section: **"Active Forks vs. Useful Forks vs. GitHub Native"**

| Capability | GitHub Native | active-forks (original) | Useful Forks | **Us** |
|-----------|--------------|------------------------|--------------|--------|
| Ahead/behind | No | No | Yes (slow) | **Yes (lazy-loaded)** |
| All forks | Caps at 2,500 | First 100 | Token required | **All, parallel fetch** |
| No token required | Yes | Yes | Partially | **Yes** |
| Health score | No | No | No | **Yes** |
| Activity sparklines | No | No | No | **Yes** |
| Smart sort | No (alphabetical) | Stars (wrong) | Ahead (single signal) | **Composite relevance** |
| Fork tree (recursive) | Broken for large repos | No | No | **Planned** |
| Export | No | No | CSV only | **CSV + JSON** |
| Dark mode | GitHub's | Ugly inversion | No | **GitHub-inspired** |
| Mobile | Yes | Broken | Broken | **Responsive** |
| Load time | Fast | Fast | Slow | **Fast (<3s)** |

**Why:** Users who are comparison-shopping need one page that makes the decision obvious. Nobody has built this.

---

### Action 8: Target the "abandoned project" moment

When a popular project gets abandoned, there's a surge of people looking for forks. This is our highest-intent audience.

**Actions:**
- **Monitor HN and Reddit** for posts about abandoned projects
- **Comment helpfully** (not spammy): "You can use [our-tool] to find which forks are still maintained. Here's a direct link for [project]: [deep-link]"
- **Create Twitter/X presence** that tweets when well-known projects go stale, with a link to our analysis
- **Build a "trending abandoned repos" feature** (future) — curated list of popular repos that recently went inactive

**Why:** This is when users are most motivated and most receptive. Meeting them at the moment of need is the highest-conversion channel.

---

### Action 9: Submit to curated lists and directories

The original appears in:
- Awesome lists (awesome-github, awesome-tools)
- Stack Overflow answers
- Dev.to / Medium articles about GitHub tips
- Browser extension directories (indirect)

**Actions:**
- Submit to relevant awesome lists as "maintained alternative"
- Write a Dev.to article: "How to Find the Best Fork of an Abandoned GitHub Project"
- Answer Stack Overflow questions about finding active forks (with disclosure)
- Reach out to authors of existing blog posts mentioning active-forks — offer the updated version

**Why:** These are permanent, high-authority backlinks that drive both SEO and direct traffic.

---

### Action 10: Ship the features nobody else has (defensible moat)

Features that no competitor offers — these create lock-in and word-of-mouth:

| Feature | Status | Why It's Defensible |
|---------|--------|-------------------|
| **Health score** | Implemented | Composite metric nobody else calculates; becomes the shared language ("this fork is Thriving") |
| **Activity sparklines** | Implemented | Visual proof of sustained activity; screenshots well for sharing |
| **Recursive fork tree** | Planned | The killer feature for Mappers; solves Issue #31 that nobody has addressed |
| **Fork network graph** | Future | Visual fork tree — the "wow" screenshot for HN/Twitter |
| **"Recommended successor" badge** | Not started | AI/heuristic pick of the single best fork — the ultimate Refugee answer |

**Priority order for defensibility:**
1. Recursive fork tree (unique capability, high wow factor, solves a real problem)
2. Fork network graph (the viral screenshot — "look at this fork tree")
3. Recommended successor badge (the one-answer solution Refugees want)

---

## Part 5: Positioning — The One-Line Pitch

### For different audiences:

| Audience | Pitch |
|----------|-------|
| **General (README/landing)** | "Find which GitHub forks have real independent work — not just which ones were pushed recently." |
| **Hacker News** | "Active Forks, rebuilt. Ahead/behind commits, health scores, all forks — the features users requested for 7 years." |
| **GitHub issue threads** | "Try [link] — it shows ahead/behind commits and health scores for every fork." |
| **SEO (meta description)** | "See ahead/behind commits, health scores, and activity sparklines for every fork of any GitHub repo. No sign-up required." |
| **vs. original** | "Same simplicity, 10x the insight. Ahead/behind, health scores, all forks, modern UI." |
| **vs. Useful Forks** | "Same depth, zero friction. No token required. Faster. Better UX." |

---

## Part 6: What NOT to Do

| Anti-pattern | Why It Fails |
|-------------|-------------|
| **Badmouth the original** | The community loves it. Disrespect = backlash. Always be grateful. |
| **Feature bloat** | Adding 50 features makes us slow and confusing. The original won on simplicity. |
| **Require sign-up or token** | The original's #1 strength is zero friction. Never add friction. |
| **Ignore the original's community** | Their issue tracker = our user research goldmine. Stay engaged. |
| **Launch too early** | One shot at HN front page. The demo must be flawless. |
| **Compete on features alone** | Distribution > features. A worse product with better distribution wins. Focus on both. |

---

## Part 7: 90-Day Priority Roadmap

### Month 1: Product Polish + Soft Launch
- Finalize all "Must Ship" features (F1-F7, F11, F15)
- Comparison screenshots (old vs. new)
- README with comparison table
- Deploy to production URL with proper meta tags
- Soft-launch: post in 3-5 original's issue threads

### Month 2: Distribution Push
- Launch on Hacker News (Show HN)
- Write Dev.to / Medium article
- Submit to awesome lists
- Answer Stack Overflow questions
- Create Twitter/X presence

### Month 3: Defensible Features
- Ship recursive fork tree (unique differentiator)
- Ship fork network visualization (viral screenshot)
- Consider browser extension (direct GitHub integration)
- Collect user feedback and iterate

---

## Summary: The 5 Things That Will Make Users Choose Us

1. **Ahead/behind by default** — the answer to the 7-year question
2. **Visual health scores** — "Thriving" is a better answer than a number
3. **All forks, not 100** — we see what the original hides
4. **Modern, fast, beautiful** — the original looks and feels abandoned
5. **Being found** — SEO, issue thread comments, HN launch, awesome lists

The product is already stronger. Now we need the world to know it exists.
