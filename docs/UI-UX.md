# UI/UX Design Guidelines

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Data-first** | The fork data is the hero; minimize chrome, maximize data density |
| **Progressive disclosure** | Show essential info first, reveal details on demand |
| **Speed perception** | Skeleton states, optimistic UI, stale-while-revalidate |
| **Accessible by default** | WCAG 2.1 AA compliance, keyboard-navigable, screen-reader friendly |
| **Responsive** | Fluid layout from 320px mobile to 2560px ultrawide |

## 2. Layout

### Desktop (>= 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]  Active Forks          [Rate Limit] [Theme] [GitHub] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  🔍  owner/repo or GitHub URL          [Search]        │  │
│  │      Recent: facebook/react · vuejs/vue · torvalds/li… │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  📦 facebook/react                                     │  │
│  │  A JavaScript library for building user interfaces     │  │
│  │  ⭐ 220k  🔱 45k  📝 1.2k issues  📅 2 days ago       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Showing 2,847 forks  │ ▼ Filters │ ↓ Export │ Cols ▼ │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Owner  │ Repo │ ⭐ │ 🔱 │ Ahead/Behind │ Push │ Score │  │
│  ├─────────┼──────┼────┼────┼──────────────┼──────┼───────┤  │
│  │  ░░░░░  │ ░░░░ │ ░░ │ ░░ │  ↑12  ↓3    │ 2d   │ ████  │  │
│  │  ░░░░░  │ ░░░░ │ ░░ │ ░░ │  ↑5   ·     │ 1w   │ ███   │  │
│  │  ░░░░░  │ ░░░░ │ ░░ │ ░░ │  ·    ↓8    │ 3mo  │ ██    │  │
│  │  ...    │ ...  │ ...│ ...│  ...         │ ...  │ ...   │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  ◀ 1 2 3 ... 57 ▶           25 │ 50 │ 100 per page   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Built with ♥ · GitHub · MIT License                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
- Stack search and repo card vertically
- Table scrolls horizontally with sticky first column (Owner)
- Collapse less important columns (Size, Forks) behind toggle

### Mobile (< 768px)
- Full-width search bar
- Repo card as compact banner
- Fork list as cards (not table) with key metrics
- Swipe to reveal secondary actions
- Bottom sheet for filters

## 3. Component Design

### 3.1 Search Bar

```
┌─────────────────────────────────────────────────┐
│  🔍  facebook/react                    [Search] │
│     ┌─────────────────────────────────────┐     │
│     │  Recent searches                    │     │
│     │  ────────────────────────────────── │     │
│     │  facebook/react          ⭐ 220k    │     │
│     │  vuejs/vue               ⭐ 206k    │     │
│     │  torvalds/linux          ⭐ 170k    │     │
│     │  ────────────────────────────────── │     │
│     │  Clear history                      │     │
│     └─────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

- Auto-complete dropdown on focus (from search history)
- Loading spinner replaces search button during fetch
- Enter key triggers search
- Paste detection: auto-parse GitHub URLs on paste

### 3.2 Ahead/Behind Badge

```
Active fork:     ↑ 24 ahead  ↓ 2 behind    [green/orange pills]
Stale fork:      · even      ↓ 142 behind   [gray/red pills]
Diverged fork:   ↑ 89 ahead  ↓ 56 behind    [blue/orange pills]
Identical:       · identical                 [gray pill]
Loading:         ░░░░░░░░░                   [skeleton]
```

### 3.3 Fork Health Score Badge

```
Very Active:  ████████████  92   [blue bg, white text]
Active:       █████████░░░  68   [green bg, white text]
Moderate:     ██████░░░░░░  42   [yellow bg, dark text]
Low:          ███░░░░░░░░░  18   [red bg, white text]
Inactive:     █░░░░░░░░░░░   5   [gray bg, white text]
```

### 3.4 Activity Sparkline

```
          ▃▅▇█▅▃▁▁▃▅▆▇▇▅▃▁▁▁▃▅██▇▅▃▁    52 weeks
          └─────── quiet ──────┘└─ active ─┘
```

- SVG-based, inline in table cell
- Hover shows tooltip: "Week of Jan 6: 14 commits"
- Color matches health score

### 3.5 Filter Panel

```
┌──────────────────────────────────────────────┐
│  Filters                           [Clear all]│
│  ──────────────────────────────────────────── │
│                                               │
│  Stars         [≥] [___10___]                 │
│  Last Push     [within] [▼ 6 months ]         │
│  Ahead         [≥] [___1____]  (has changes)  │
│  Language      [▼ Any________]                │
│  Has Issues    [☑]                            │
│  Health Score  [───●──────────] ≥ 25          │
│                                               │
│  Showing 847 of 2,847 forks                   │
└──────────────────────────────────────────────┘
```

### 3.6 Token Configuration

```
┌──────────────────────────────────────────────────────┐
│  ⚠ Unauthenticated: 42/60 requests remaining        │
│  [Add GitHub Token] for 5,000 requests/hour          │
│                                                       │
│  Expanded:                                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  GitHub Personal Access Token                 │    │
│  │  [••••••••••••••••••••••ghp_xxx]  [✓] [✕]     │    │
│  │  Token needs: public_repo scope (read-only)   │    │
│  │  Create token at github.com/settings/tokens   │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

## 4. Color System

### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#ffffff` | Page background |
| `--bg-secondary` | `#f9fafb` | Card backgrounds |
| `--bg-tertiary` | `#f3f4f6` | Table striped rows |
| `--text-primary` | `#111827` | Main text |
| `--text-secondary` | `#6b7280` | Supporting text |
| `--border` | `#e5e7eb` | Borders and dividers |
| `--accent` | `#2563eb` | Links, primary actions |
| `--accent-hover` | `#1d4ed8` | Hover state |
| `--success` | `#059669` | Ahead commits, active |
| `--warning` | `#d97706` | Behind commits, moderate |
| `--danger` | `#dc2626` | Errors, inactive |

### Dark Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0d1117` | Page background (GitHub dark) |
| `--bg-secondary` | `#161b22` | Card backgrounds |
| `--bg-tertiary` | `#21262d` | Table striped rows |
| `--text-primary` | `#f0f6fc` | Main text |
| `--text-secondary` | `#8b949e` | Supporting text |
| `--border` | `#30363d` | Borders and dividers |
| `--accent` | `#58a6ff` | Links, primary actions |
| `--accent-hover` | `#79c0ff` | Hover state |
| `--success` | `#3fb950` | Ahead commits, active |
| `--warning` | `#d29922` | Behind commits, moderate |
| `--danger` | `#f85149` | Errors, inactive |

## 5. Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page title | System sans-serif | 24px / 1.5rem | 700 |
| Section header | System sans-serif | 18px / 1.125rem | 600 |
| Table header | System sans-serif | 13px / 0.8125rem | 600 |
| Table body | System mono (for numbers), sans for text | 14px / 0.875rem | 400 |
| Small / caption | System sans-serif | 12px / 0.75rem | 400 |

Font stack: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
Mono stack: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`

## 6. Loading States

### Initial Page Load
- Skeleton search bar renders instantly
- No content below until search is submitted

### Fork Fetch In Progress
```
┌──────────────────────────────────────────────┐
│  Fetching forks...  ████████░░░░ 8/24 pages  │
│  ──────────────────────────────────────────── │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────────────┘
```

- Progress bar shows pages fetched / total pages
- Skeleton rows appear during initial load
- Table populates progressively as pages arrive

### Ahead/Behind Loading
- Each cell shows a shimmer animation until its data loads
- Data loads lazily as rows scroll into view

### Error State
```
┌──────────────────────────────────────────────┐
│  ⚠ Repository not found                     │
│                                               │
│  Could not find "facbook/react".             │
│  Did you mean facebook/react?                │
│                                               │
│  [Try facebook/react]  [Clear]               │
└──────────────────────────────────────────────┘
```

## 7. Interaction Patterns

### Keyboard Shortcuts (Power Users)

| Shortcut | Action |
|----------|--------|
| `/` | Focus search bar |
| `Escape` | Close dropdowns / clear filters |
| `j` / `k` | Navigate table rows (vim-style) |
| `Enter` | Open selected fork in new tab |
| `t` | Toggle theme |
| `?` | Show keyboard shortcut help |
| `e` | Open export menu |

### Table Interactions
- **Click column header**: Sort ascending; click again for descending; third click removes sort
- **Shift + click header**: Add secondary sort
- **Hover row**: Subtle highlight, show action buttons (open, compare, expand)
- **Click row**: Select row (for batch actions)
- **Double-click row**: Open fork in new tab

## 8. Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Theme toggle | Color transition | 200ms | ease-in-out |
| Table row enter | Fade in + slide up | 150ms | ease-out |
| Dropdown open | Scale + fade | 150ms | ease-out |
| Skeleton shimmer | Linear gradient sweep | 1.5s | linear (loop) |
| Progress bar | Width transition | 300ms | ease-out |
| Sparkline draw | Path stroke animation | 500ms | ease-out |
| Tooltip | Fade in | 100ms | ease-in |

## 9. Empty States

### No Search
```
┌──────────────────────────────────────────────┐
│                                               │
│            🔍                                 │
│    Search for a GitHub repository             │
│    to discover its most active forks          │
│                                               │
│    Try: facebook/react · vuejs/vue            │
│         torvalds/linux · microsoft/vscode     │
│                                               │
└──────────────────────────────────────────────┘
```

### No Forks Found
```
┌──────────────────────────────────────────────┐
│                                               │
│            🔱                                 │
│    No forks found                             │
│    This repository has not been forked yet    │
│                                               │
└──────────────────────────────────────────────┘
```

### No Results After Filter
```
┌──────────────────────────────────────────────┐
│                                               │
│            🔍                                 │
│    No forks match your filters               │
│    Try adjusting or clearing your filters     │
│                                               │
│    [Clear all filters]                        │
│                                               │
└──────────────────────────────────────────────┘
```

## 10. Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Focus management | Visible focus rings, logical tab order |
| Screen reader | ARIA labels on interactive elements, live regions for updates |
| Color contrast | Minimum 4.5:1 for text, 3:1 for UI components |
| Motion sensitivity | Respect `prefers-reduced-motion`, disable animations |
| Keyboard navigation | All features accessible without mouse |
| Text scaling | Layout works at 200% zoom |
| Alt text | Avatar images include owner name as alt text |
