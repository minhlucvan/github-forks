# Feature Specifications

## F1: Repository Search

### Description
Users can search for forks of any public GitHub repository by entering the repository identifier.

### Accepted Input Formats
| Format | Example |
|--------|---------|
| `owner/repo` | `facebook/react` |
| Full URL | `https://github.com/facebook/react` |
| URL with trailing paths | `https://github.com/facebook/react/tree/main` |
| URL with `.git` suffix | `https://github.com/facebook/react.git` |

### Behavior
1. Strip and normalize input (trim whitespace, remove protocol/domain prefix, remove `.git` suffix, remove trailing slashes and path segments)
2. Validate format matches `owner/repo` pattern
3. Update URL query parameter (`?repo=facebook/react`)
4. Fetch parent repository details
5. Fetch all fork pages
6. Display error for invalid repos or API failures

### Error States
| Condition | Message |
|-----------|---------|
| Empty input | "Enter a repository in owner/repo format" |
| Invalid format | "Invalid repository format. Use owner/repo" |
| 404 Not Found | "Repository not found. Check the owner and repo name" |
| 403 Rate Limited | "API rate limit exceeded. Add a GitHub token for 5,000 requests/hour" |
| Network error | "Network error. Check your connection and try again" |

---

## F2: Fork Data Table

### Columns

| Column | Source | Sortable | Default |
|--------|--------|----------|---------|
| Owner | `fork.owner.login` + `fork.owner.avatar_url` | Yes | -- |
| Repository | `fork.full_name` | Yes | -- |
| Default Branch | `fork.default_branch` | No | -- |
| Stars | `fork.stargazers_count` | Yes | Sort desc |
| Forks | `fork.forks_count` | Yes | -- |
| Open Issues | `fork.open_issues_count` | Yes | -- |
| Size | `fork.size` (humanized to KB/MB/GB) | Yes | -- |
| Last Push | `fork.pushed_at` (relative time) | Yes | -- |
| Ahead/Behind | GraphQL comparison | Yes | -- |
| Activity | Sparkline from commit data | No | -- |

### Features
- **Multi-column sorting**: Click column headers, shift-click for secondary sort
- **Column visibility toggle**: Users can show/hide columns
- **Resizable columns**: Drag column borders to resize
- **Sticky header**: Table header stays visible on scroll
- **Row click**: Expand row to show more details or navigate to fork
- **Pagination**: 25 / 50 / 100 rows per page with page navigation
- **Virtual scrolling**: For datasets > 500 rows, enable virtualization

---

## F3: Ahead/Behind Comparison

### Description
Show how many commits each fork is ahead of or behind the parent repository's default branch.

### Data Source
GitHub REST API: `GET /repos/{owner}/{repo}/compare/{base}...{head}`
- `base`: parent repo default branch
- `head`: fork `owner:default_branch`

### Display
```
  ↑ 12 ahead   ↓ 3 behind      (fork has unique commits and is missing parent commits)
  ↑ 5 ahead    · even           (fork has unique commits, up to date with parent)
  · even       ↓ 8 behind       (no unique commits, missing parent commits)
  · even       · even           (identical to parent)
```

### Performance
- **Lazy loading**: Only fetch for forks visible in viewport
- **Batch requests**: Queue and throttle to max 5 concurrent comparison requests
- **Caching**: Cache results for 5 minutes (stale-while-revalidate)
- **Loading state**: Show skeleton/shimmer while loading

---

## F4: Pagination (All Forks)

### Description
Fetch all forks for a repository, not just the first 100.

### Implementation
1. First request: `GET /repos/{owner}/{repo}/forks?per_page=100&page=1`
2. Parse `Link` header to determine total pages
3. Fetch remaining pages in parallel (max 5 concurrent requests)
4. Merge results and sort client-side
5. Display progress bar during multi-page fetch

### Rate Limit Awareness
- Before fetching: estimate requests needed, warn if it will exceed rate limit
- Show "This repo has ~2,400 forks. Fetching all pages will use 24 API requests."
- If unauthenticated and pages > 1, suggest adding a token

---

## F5: Theme System

### Modes
| Mode | Behavior |
|------|----------|
| Light | Force light theme |
| Dark | Force dark theme |
| System | Follow OS `prefers-color-scheme` |

### Implementation
- Tailwind `darkMode: 'class'` strategy
- Toggle button in header (sun/moon/monitor icons)
- Persist choice in `localStorage` key `theme`
- Apply `dark` class to `<html>` element
- Smooth 200ms transition on background and text colors

---

## F6: Shareable URLs

### URL Structure
```
https://example.com/?repo=facebook/react&sort=stars&order=desc&filter=ahead:gt:0
```

### Query Parameters
| Parameter | Description | Example |
|-----------|-------------|---------|
| `repo` | Repository to search | `facebook/react` |
| `sort` | Sort column | `stars`, `forks`, `pushed`, `ahead` |
| `order` | Sort direction | `asc`, `desc` |
| `filter` | Active filters | `ahead:gt:0` |
| `page` | Current page | `1` |
| `per_page` | Rows per page | `25`, `50`, `100` |

### Behavior
- URL updates on every sort/filter/page change (replace state, no history push)
- On page load, parse URL and restore state
- "Copy link" button generates shareable URL

---

## F7: GitHub Token Management

### Description
Users can optionally provide a GitHub personal access token to increase API rate limits from 60 to 5,000 requests per hour.

### UI
- Collapsed section below search bar: "Using GitHub unauthenticated (60 req/hr). Add token for more."
- Token input field (password type) with save/clear buttons
- Visual indicator of current rate limit status

### Security
- Token stored in `localStorage` (never sent to any third-party server)
- Only `public_repo` scope needed (read-only access to public data)
- Clear token button with confirmation
- Token validation on save (test with `/user` endpoint)

---

## F9: Commit Activity Visualization

### Description
Show a mini sparkline chart for each fork showing recent commit activity.

### Data Source
GitHub API: `GET /repos/{owner}/{repo}/stats/commit_activity`
Returns weekly commit counts for the last 52 weeks.

### Display
- Inline SVG sparkline (52 data points, last year)
- Tooltip on hover showing week and commit count
- Color: theme-aware (gray-400 in light, gray-500 in dark)
- Size: 120px wide x 24px tall

### Performance
- Lazy load: only fetch for visible rows
- Cache for 10 minutes
- Fallback: show "No data" for forks with no recent activity

---

## F10: Recursive Fork Tree

### Description
Discover and display forks of forks (second-level forks and beyond).

### Behavior
1. Initial view shows direct forks of the searched repo
2. "Expand" button on each fork row reveals its sub-forks
3. Indented rows show the fork hierarchy
4. Optional: tree visualization view (collapsible tree diagram)

### Limits
- Max depth: 3 levels (configurable)
- Lazy load: sub-forks fetched on expand click
- Warning: "This fork has 500+ sub-forks. Loading may use many API requests."

---

## F11: Parent Repository Card

### Description
Display information about the parent/source repository above the fork table.

### Fields
| Field | Description |
|-------|-------------|
| Full name | `owner/repo` with link |
| Description | Repository description |
| Stars / Forks / Issues | Key metrics |
| Language | Primary language with color dot |
| License | License type |
| Last push | Relative time |
| Created | Date created |
| Topics | Repository topics as badges |

---

## F12: Export Results

### Formats
| Format | Content |
|--------|---------|
| **CSV** | All visible columns, respecting current sort/filter |
| **JSON** | Full fork data objects for filtered results |

### Behavior
- Export button in toolbar above table
- Dropdown menu: "Export as CSV" / "Export as JSON"
- File name: `forks-{owner}-{repo}-{date}.{ext}`
- Only exports currently filtered/visible data
- Includes ahead/behind data if loaded

---

## F14: Fork Health Score

### Description
A composite metric indicating how "alive" a fork is, displayed as a colored badge.

### Algorithm
```
score = (
  (stars * 2) +
  (forks * 3) +
  (has_issues_enabled ? 5 : 0) +
  (recency_score * 10) +           // 0-10 based on last push date
  (ahead_commits * 1) +
  (has_description ? 2 : 0) +
  (has_readme_changes ? 5 : 0)     // if detectable
)
```

### Display
| Score Range | Label | Color |
|-------------|-------|-------|
| 0-10 | Inactive | Gray |
| 11-25 | Low | Red |
| 26-50 | Moderate | Yellow |
| 51-75 | Active | Green |
| 76+ | Very Active | Blue |

---

## F15: Search History

### Description
Show recently searched repositories for quick re-access.

### Behavior
- Store last 20 searches in `localStorage`
- Dropdown below search input showing recent searches
- Each entry shows: `owner/repo`, star count, time searched
- Click to re-search
- "Clear history" button
- Keyboard navigable (arrow keys + enter)
