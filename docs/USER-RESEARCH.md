# User Research: Who Uses Active Forks and Why

## The Core Insight

> **"Active" is the wrong word for what users actually want.**

Users don't just want to know which fork was touched most recently. They want to know which fork has **meaningful divergent work** — which one has features the original lacks, which one fixed bugs, which one is the legitimate successor project.

The original tool answers: *"When was each fork last pushed to?"*
Users actually need: *"Which fork has done the most useful independent work?"*

This gap — between **recency** and **relevance** — is the central design problem.

---

## How Users Find Us

### Discovery Channels (ranked by volume)

| Channel | How It Works | Implication |
|---------|-------------|-------------|
| **Google search** | Users search "find active github forks," "github abandoned project find fork," "most active fork" | SEO matters. We need to rank for these exact queries |
| **Hacker News** | Resurfaces every 1-2 years when someone asks about abandoned projects | HN audience = power users who want depth, not just simplicity |
| **Word of mouth in issue threads** | Users share the tool in issues of abandoned repos: "try active-forks to find a maintained version" | Our URL gets pasted into GitHub issues. The link-click experience must be instant |
| **Stack Overflow answers** | Appears in answers to "how to find active GitHub forks" questions | Needs to work without any setup — zero-friction first impression |
| **Browser extension stores** | Extensions by ridvanaltun, ChaliceChore (Greasefork), yashx route users to us | Extension/bookmarklet integration is a real discovery path |
| **Meta-recursive discovery** | Users literally use active-forks to find better forks of active-forks itself | The tool is a living demo of the problem it solves |

### The Arrival Moment

Users arrive in a specific emotional state: **frustrated with GitHub's native fork UI.**

> *"GitHub has elected to not provide a way to filter or sort these forks"* — HN commenter

> *"The forks page becomes overwhelming: 'Woah, this network is huge!'"* — HN commenter

> *"Novice users fork projects unnecessarily, polluting the list"* — HN commenter

They've already tried GitHub's Forks tab, found it useless, and googled for help. They want an answer **now**, not a setup process.

**Design implication:** The first 5 seconds must deliver value. No sign-up, no token required, no tutorial. Search → results → answer.

---

## User Segments

### Segment A: "The Abandoned-Project Refugee" (largest group)

**Who:** A developer who depends on a library/tool that stopped getting updates. Broken builds, unpatched security issues, or missing features drove them to look for alternatives.

**Triggering moment:** "My project depends on X, X hasn't been updated in 2 years, 3 PRs are sitting unmerged. Someone must have forked it and kept going."

**What they need:**
- Quick answer: "Which fork is the most alive?"
- Signal: recent commits, ahead of original, has stars/community
- One-click navigation to the best fork

**What they do today:**
- Sort by "Last Push" and pick the top result
- Manually click through 5-10 forks checking their README and recent commits

**Key quote:**
> *"The main point of the project is to show the Active Forks, but when you enter the site and type a repo URL, it doesn't give results sorted by 'latest push'."* — ttodua, Issue #52

**What would delight them:** A "recommended successor" badge that combines recency + ahead commits + stars into a single signal.

---

### Segment B: "The Quality Evaluator" (most vocal in issues)

**Who:** A developer who knows multiple active forks exist and needs to choose the right one to adopt. They're doing due diligence before making a dependency switch.

**Triggering moment:** "There are 15 forks that were pushed to this month. Which one has the real work? Which one just has a README typo fix?"

**What they need:**
- Ahead/behind commit counts (the #1 requested feature for 7+ years)
- Ability to compare forks to each other
- Signals of intentional divergence vs. noise

**What they do today:**
- Use lukaszmn's fork (slow but shows ahead/behind)
- Switch to Useful Forks for comparison data
- Manually open GitHub compare URLs between forks

**Key quote:**
> *"An 'ahead' column would give you a good idea which branches have actually been worked on independently by the forker. These are the only interesting ones!"* — countingpine, Issue #17

> *"Often users are looking for forks that are ahead of original repository."* — AndriyKalashnykov, Issue #61

**What would delight them:** One-click "show me only forks with meaningful changes" filter.

---

### Segment C: "The Ecosystem Mapper" (power users)

**Who:** Developer or researcher wanting to understand the full fork landscape — not just direct forks, but the entire network of who forked whom and what they changed.

**Triggering moment:** "The most active version of this project might be a fork-of-a-fork that doesn't show up in the original's fork list."

**What they need:**
- Recursive fork traversal (forks of forks)
- Ability to fetch ALL forks (not just 100)
- Export data for analysis
- Fork network visualization

**What they do today:**
- Manually follow fork chains
- Use GitHub's Network graph (which is broken for large repos)
- Build custom scripts with the GitHub API

**Key quote:**
> Issue #31 demonstrated how the most active continuation of MonitorControl.OSX was a fork-of-a-fork that wouldn't appear in the standard fork list.

**What would delight them:** A visual fork tree showing the full lineage and where the real work is happening.

---

### Segment D: "The Workflow Integrator" (wants zero context-switching)

**Who:** A developer who browses GitHub daily and wants fork intelligence embedded in their existing workflow, not on a separate website.

**Triggering moment:** "I'm already on this GitHub repo page. I shouldn't have to copy the URL, open another site, and paste it in."

**What they need:**
- Browser extension that adds fork info directly to GitHub pages
- Bookmarklet for one-click access
- Deep linking so shared URLs work instantly

**What they do today:**
- Use the bookmarklet (if they know about it)
- Use Lovely Forks extension (shows ONE notable fork inline)
- Copy-paste URLs manually

**Key quote:**
> *"A Chrome extension to integrate it directly into GitHub's interface... adding a button on repository pages that would allow users to access active-forks without leaving GitHub."* — fire17, Issue #78

**What would delight them:** See fork health data without ever leaving GitHub.

---

### Segment E: "The Would-Be Maintainer" (wants to help)

**Who:** Developer who loves the tool, uses it regularly, and is willing to contribute code or take over maintenance.

**Triggering moment:** "This tool is incredibly useful but clearly unmaintained. I could make it better."

**What they need:**
- Clean, modern codebase they can contribute to
- Clear contribution guidelines
- Responsive maintainer who reviews PRs

**Key quotes:**
> *"Interested in help maintain the project + fork... fetching all forks, using graphql, ahead/behind status, 'recursive' forks"* — Souvlaki42, Issue #92

> *"Interested in becoming a maintainer"* — jacob-willden, Issue #80

**What would delight them:** A well-architected codebase with tests, CI, and a welcoming CONTRIBUTING.md.

---

## Jobs-to-Be-Done Framework

| Job | Trigger | Current Solution | Frustration |
|-----|---------|-----------------|-------------|
| **Find the successor** to an abandoned project | Build breaks, security vuln, feature needed | Sort by "Last Push" in active-forks | Last Push is unreliable; can't tell if fork is meaningful |
| **Evaluate which fork to adopt** before switching | Multiple active forks exist | Manually compare forks on GitHub | No ahead/behind data; have to open each fork individually |
| **Discover the full fork network** including forks-of-forks | Direct fork list doesn't show the real successor | Follow fork chains manually | Limited to 100 forks; no recursive discovery |
| **Stay aware** of fork activity for projects I care about | Ongoing monitoring need | Re-visit the tool periodically | No notifications, no bookmarks, no history |
| **Share findings** with my team | Need to justify a dependency switch | Screenshot or copy-paste | No easy export; URLs don't preserve sort/filter state |
| **Get fork info** without leaving GitHub | Browsing a repo page | Bookmarklet or manual URL copy | Context switch is annoying; bookmarklet is obscure |

---

## Key Frustrations (Ranked by Impact)

### 1. No ahead/behind commit information (THE critical gap)

**Evidence:** 22 comments on Issue #17 (2018), 17 comments on PR #30 (2019), plus Issues #61 and #66. Requested for **7+ years** and never implemented.

**Why it matters deeply:** Without this, the tool shows *when* a fork was touched but not *what* it did. A fork pushed yesterday with a README typo is indistinguishable from a fork 200 commits ahead with real features.

**User impact:** This single missing feature is the #1 reason users switch to Useful Forks or lukaszmn's fork.

### 2. API rate limiting destroys the experience

**Evidence:** Issue #30 shows 100+ API 403 errors. Users hit the 60 req/hr limit almost immediately for popular repos.

**Why it matters:** The tool becomes unusable exactly when you need it most — for popular projects with many forks.

### 3. Only fetches 100 forks (the pagination wall)

**Evidence:** Issue #13 (open since 2018, 10 comments). For React (20K+ forks) or Linux, you see <1% of forks.

**Why it matters:** The most active fork might be fork #347. You'd never know.

### 4. Inaccurate "Last Push" date

**Evidence:** Issue #32 with community agreement: *"The 'last push' column is always inaccurate while it's the most relevant information we need."*

**Why it matters:** The primary sorting signal is broken.

### 5. Wrong default sort order

**Evidence:** Issue #52. Sorts by stars instead of last push. Stars measure historical popularity, not current activity.

### 6. The tool itself appears abandoned

**Evidence:** Issues #80, #92. Maintainer patterns like *"I will try to get this in next weekend"* (2018) followed by years of silence.

**The meta-irony:** A tool for finding maintained forks of abandoned projects... needs someone to find a maintained fork of it.

> *"You could use this project to investigate active forks on this repository."* — floatas, Issue #17

---

## What Users Do When We Fail Them

| Workaround | Who does this | What it tells us |
|------------|---------------|-----------------|
| Use lukaszmn/active-forks | Quality Evaluators | Ahead/behind is worth waiting for (his fork is slow but has the data) |
| Switch to Useful Forks | Everyone | It's our main competitor; wins on depth of data |
| Use Lovely Forks extension | Workflow Integrators | Passive, inline fork info is a different (valuable) UX paradigm |
| Use active-forks on itself | Meta users | The irony is real; users look for better forks of this exact tool |
| Build CLI scripts | Power users | Some problems need automation, not a web UI |
| Just browse forks manually | Frustrated users | We failed them; they gave up on tooling |

---

## Competitive Landscape

| Tool | Position | Strength | Weakness |
|------|----------|----------|----------|
| **active-forks (original)** | "Quick and simple" | Zero friction, instant, no token needed | Shallow data, no ahead/behind, 100 fork limit |
| **Useful Forks** | "The complete solution" | Ahead/behind, CSV export, Chrome extension | Requires token for heavy use, cluttered UI |
| **Lovely Forks** | "Passive awareness" | Shows notable fork directly on GitHub pages | Only shows ONE fork; no search/comparison |
| **Fork.rip** | "Clean modern UI" | Nice design, ahead/behind with GitHub login | Can't handle very large repos |
| **GitHub native** | "Built-in" | No tool needed | No ahead/behind, caps at 2,500, very basic |

### Our Opportunity

There is a clear gap in the market for a tool that combines:
- **active-forks' zero-friction simplicity** (no token required to start)
- **Useful Forks' data depth** (ahead/behind, meaningful comparison)
- **Modern UI/UX** (none of the existing tools look or feel contemporary)
- **Ecosystem mapping** (recursive forks, fork trees — nobody does this well)

The winning position: **"Understand the fork landscape in seconds, go deep when you need to."**

---

## Design Principles (Derived from User Research)

| Principle | Derived From | Means In Practice |
|-----------|-------------|-------------------|
| **Zero friction first impression** | Users arrive frustrated from GitHub, want instant answers | No token required. Search → results in <3 seconds. Works on paste |
| **Relevance over recency** | "Active" ≠ recently pushed; users want meaningful divergence | Default sort should weight ahead-commits, not just last-push |
| **Progressive depth** | Segment A wants quick answers; Segment C wants full analysis | Show simple table first; reveal activity charts, fork trees, export on demand |
| **Respect rate limits gracefully** | 60 req/hr limit breaks the experience for large repos | Lazy-load enriched data; show what we have while fetching more; clear rate limit UX |
| **Shareable by default** | Users paste this tool in issue threads of abandoned repos | Every state is a URL. Copy-link button is prominent. OG meta tags for link previews |
| **Don't become what we replace** | The original abandoned itself; contributors left frustrated | Modern stack, tests, CI, welcoming contribution process |
