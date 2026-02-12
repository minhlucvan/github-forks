# Design System — Active Forks

## Direction

**Personality:** Precision & Density — screenshot-attractive, data IS the decoration
**Foundation:** Achromatic light, GitHub-inspired cool neutral dark, one brand accent (blue-violet)
**Depth:** shadow-sm + border (light), surface lightness shifts (dark)

## Intent

**Who:** Developers with a dead dependency — frustrated, scanning fast, copying a fork URL to their `package.json` in under 10 seconds.

**What they must accomplish:** Find the most active/divergent fork of a GitHub repo — grade submissions by health score, ahead/behind count, and recent activity.

**Feel:** Calm confidence. Restrained color palette. Whitespace is a feature. Color only where it carries meaning. Dense enough for power users scanning 2,000+ forks, but not cluttered. Screenshot-worthy — every screen looks good in a 1200x630 OG image.

## Signature

**GitHub-native dark mode.** The dark palette uses GitHub's own color system (#0d1117, #161b22, #1c2128, #21262d) with a subtle cool blue tint (hue 264, chroma 0.005–0.008). This creates instant recognition — our users live on GitHub. The dark mode feels like home, not like a generic template.

**Brand accent.** Blue-violet (hue ~260) for interactive chrome only — keeps domain colors (ahead/behind/tiers) unchanged. Gives the app a recognizable identity beyond generic shadcn.

## Tokens

### Spacing
Base: 4px (Tailwind default)
Scale: 4, 8, 12, 16, 24, 32, 48, 64 (via Tailwind spacing utilities)

### Colors
Color model: oklch — perceptually uniform lightness across hues.

#### Surface Elevation

**Light mode:** All surfaces are white. Hierarchy from border + shadow-sm.
**Dark mode:** Each level is +0.04 lightness in the GitHub cool blue-gray.

| Level | Purpose | Light | Dark |
|-------|---------|-------|------|
| L0 Canvas | Page background | `oklch(1 0 0)` | `oklch(0.13 0.005 264)` |
| L1 Card | Raised surface | `oklch(1 0 0)` | `oklch(0.17 0.006 264)` |
| L2 Popover | Dropdown/popover | `oklch(1 0 0)` | `oklch(0.20 0.006 264)` |

#### Text Hierarchy

| Level | Purpose | Light | Dark |
|-------|---------|-------|------|
| Primary | Default text | `oklch(0.145 0 0)` | `oklch(0.87 0.008 264)` |
| Secondary | Actions, emphasis | `oklch(0.205 0 0)` | same as primary |
| Muted | Metadata, timestamps | `oklch(0.556 0 0)` | `oklch(0.64 0.008 264)` |

#### Boundaries

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--border` | Standard separation | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--input` | Control borders | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | Focus ring | `oklch(0.708 0 0)` | `oklch(0.50 0.008 264)` |

Alpha borders in dark mode blend naturally with any surface elevation.

#### Brand Accent

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--brand-accent` | Interactive chrome, header "Active" word, focus rings | `oklch(0.55 0.20 260)` | `oklch(0.70 0.18 260)` |
| `--brand-accent-foreground` | Text on accent surfaces | `oklch(1 0 0)` | `oklch(0.13 0.005 264)` |

Used for: header branding, filter active indicator, feature icons on landing. NOT for domain data (ahead/behind/health tiers).

#### Domain-Specific Semantic Colors

Fork divergence:
| Token | Meaning | Light | Dark |
|-------|---------|-------|------|
| `--ahead` | Commits ahead (green) | `oklch(0.65 0.19 160)` | `oklch(0.65 0.17 155)` |
| `--behind` | Commits behind (amber) | `oklch(0.70 0.15 65)` | `oklch(0.65 0.13 60)` |

Health score tiers (with per-tier foreground for WCAG AA contrast):
| Tier | Light bg | Light fg | Dark bg | Dark fg |
|------|----------|----------|---------|---------|
| Thriving (blue) | `oklch(0.52 0.19 255)` | white | `oklch(0.60 0.17 260)` | near-white |
| Active (green) | `oklch(0.55 0.17 160)` | white | `oklch(0.62 0.15 155)` | near-white |
| Moderate (amber) | `oklch(0.70 0.15 65)` | dark | `oklch(0.62 0.13 60)` | near-white |
| Low (orange) | `oklch(0.58 0.20 35)` | white | `oklch(0.62 0.17 40)` | near-white |
| Inactive (gray) | `oklch(0.55 0 0)` | white | `oklch(0.40 0 0)` | light gray |

Dark mode scores are slightly desaturated — saturated colors feel harsher on dark backgrounds.

### Radius
```
--radius: 0.625rem (10px)
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 10px
--radius-xl: 14px
```

### Typography
Font: system-ui (Tailwind default — fast, native, invisible)
Text hierarchy via shadcn tokens: foreground → secondary-foreground → muted-foreground
Weight: normal (400), medium (500), semibold (600), bold (700 — score numbers only)
Numeric data: tabular-nums for column alignment

### Depth Strategy

**Light mode:** border + shadow-sm on cards, shadow-md on popovers.
**Dark mode:** surface lightness elevation. Shadows are invisible on dark backgrounds — don't use them. Borders at `oklch(1 0 0 / 10%)` define edges without harshness.

## Patterns

### Button (CVA variants)
- Default: h-9 (36px), px-4, rounded-md, bg-primary text-primary-foreground
- Small: h-8 (32px), px-3
- Extra small: h-6 (24px), px-2, text-xs
- Large: h-10 (40px), px-6
- Icon: size-9 (36px square)
- Variants: default, destructive, outline, secondary, ghost, link

### Card
- Surface: bg-card text-card-foreground
- Border: 1px solid (via `border` class)
- Shadow: shadow-sm (light mode only)
- Radius: rounded-xl
- Padding: py-6, content px-6
- Compound: Card > CardHeader > CardTitle + CardDescription + CardAction > CardContent > CardFooter
- **Accent border:** Repo card uses `h-1 bg-gradient-to-r from-ahead to-score-thriving` top strip
- **Avatar:** 40px owner avatar left of title in repo card, 24px in fork table rows

### Badge (CVA variants)
Domain variants use semantic foreground tokens (not hard-coded text-white):
- `ahead`: bg-ahead text-ahead-foreground
- `behind`: bg-behind text-behind-foreground
- `identical`: bg-muted text-muted-foreground
- `thriving` through `inactive`: bg-score-{tier} text-score-{tier}-foreground
- `outline`: border-border text-foreground (used for topic chips)

### Health Score Ring
- SVG donut indicator: 24x24px, 2.5px stroke
- Background track: `stroke-muted`
- Score arc: `stroke-score-{tier}`, fill proportional to score (0-100)
- Arc animates via CSS `transition-[stroke-dashoffset] duration-500 ease-out`
- Layout: ring + bold score number + tier label (hidden on mobile)
- Tooltip shows breakdown: Ahead, Stars, Recency, Issues

### Ahead/Behind Badges
- Uses ↑/↓ arrows (not +/-): `↑24` ahead, `↓2` behind
- Ahead badge is `font-semibold`, behind is regular weight
- `· even` for zero values, `· identical` for identical forks
- `—` dash for unavailable (rate limited)
- Skeleton: two `h-5 w-14 rounded-full` shimmers while loading

### Activity Sparkline
- SVG: 120x32px (expanded from 80x20), 12 data points (last 12 weeks)
- Line: `stroke-ahead/70`, 1.5px, rounded caps and joins
- Fill: linear gradient `ahead` color, 20% opacity top → 2% bottom
- Unique gradient ID per instance (avoids SVG `<defs>` collisions)
- `—` dash for no data

### Health Summary Bar
- Stacked horizontal bar above the table (like GitHub's language bar)
- Segments colored by tier, width proportional to count
- Labels below with dot + count + tier name
- Clickable: segments and labels toggle `healthTier` filter
- Active tier is full opacity; others dim to `opacity-40`
- Segments animate in with `bar-grow` (scaleX from 0)

### Quick-Filter Chips
- Three toggle chips in toolbar: All / Meaningful / Active
- `rounded-full px-2.5 py-1 text-xs font-medium`
- Active: `bg-primary text-primary-foreground`
- Inactive: `bg-secondary text-secondary-foreground`
- **Meaningful** = ahead > 0 AND pushed within 1 year AND stars > 0
- **Active** = pushed within 6 months
- **All** = clear all filters

### Table Row Treatment
- Top 3 rows (by score) get permanent `border-l-2 border-l-score-{tier}` left accent
- All rows animate in with `row-fade-in` (opacity 0→1, translateY 4px→0, 150ms ease-out)
- Standard `hover:bg-muted/50` on hover

### Header
- Fork icon (16px, muted) + "Active" in `text-brand-accent` + "Forks" in foreground
- Compact: icon + brand name + rate limit + theme toggle

### Landing State (Empty)
- Gradient headline: "Find the **best** fork" with `bg-gradient-to-r from-brand-accent to-score-thriving bg-clip-text text-transparent`
- Subtitle: "of any GitHub repository"
- Clickable example repo chips: rounded-full border, hover bg-accent
- Feature bullets: 2x2 grid with domain-colored icons (ahead, thriving, accent, behind)

### Data Display
- Ahead/behind badges: most prominent data per row — bigger than stars, bolder than dates
- Health score: ring indicator using --score-* tokens
- Activity sparklines: lazy-loaded, progressive reveal, gradient fill
- Tables: tabular-nums for numeric alignment
- Owner avatars: 24px rounded-full in fork table, `loading="lazy"`, explicit width/height

### Progressive Disclosure
- Layer 1: Table + sort + summary bar (Refugee path)
- Layer 2: Quick-filter chips + manual filters + sparklines (Evaluator path)
- Layer 3: Fork tree + export (Mapper path)
- Filters collapsed by default, expanded on click
- Quick-filter chips always visible for one-click filtering

## Animations

All animations respect `prefers-reduced-motion: reduce` — if enabled, all durations go to 0.01ms.

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Summary bar segments | `bar-grow`: scaleX(0→1), transform-origin left | 500ms | ease-out |
| Table rows | `row-fade-in`: opacity 0→1, translateY 4→0 | 150ms | ease-out |
| Score ring arc | CSS transition on stroke-dashoffset | 500ms | ease-out |
| Theme switch | Background + text color cross-fade | 200ms | ease-in-out |
| Dropdown open | Scale(0.95→1) + opacity(0→1) | 150ms | ease-out |
| Quick-filter chip | Background color transition | — | via `transition-colors` |

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| oklch color model | Perceptually uniform — consistent lightness across hues for health score tiers | 2026-02-12 |
| Achromatic light mode | Calm confidence — color reserved for meaning (ahead/behind/health) | 2026-02-12 |
| GitHub-inspired dark (#0d1117) | Users live on GitHub — dark mode should feel like home, not a template | 2026-02-12 |
| Hue 264, chroma 0.005–0.008 | Cool blue barely-tint. Recognition without decoration | 2026-02-12 |
| Surface elevation via lightness | Dark mode shadows are invisible — use +0.04L steps instead | 2026-02-12 |
| Alpha borders in dark mode | `oklch(1 0 0 / 10%)` blends with any surface level naturally | 2026-02-12 |
| Per-tier score foregrounds | WCAG AA contrast on every health badge, adapts per mode | 2026-02-12 |
| Score desaturation in dark mode | Saturated colors feel harsh on dark backgrounds — pull chroma back ~15% | 2026-02-12 |
| shadow-sm + border depth | Dense data tool — subtle lift without visual weight | 2026-02-12 |
| shadcn/ui + Tailwind v4 + Radix | Accessible primitives, consistent tokens, fast iteration | 2026-02-12 |
| Brand accent blue-violet (hue 260) | One confident color for personality. Fits dark mode hue 264. Doesn't compete with domain colors | 2026-02-12 |
| Score ring over flat badge | Ring fills proportionally — communicates magnitude, not just category. Visual anchor of the table | 2026-02-12 |
| ↑/↓ arrows over +/- | Directional arrows are scannable at a glance. "↑24" reads as "24 ahead" without labels | 2026-02-12 |
| Owner avatars (24px) | Instant visual richness. No extra API call (avatar_url already in fork data). Table looks GitHub-native | 2026-02-12 |
| Summary bar above table | Hero visual for screenshots. At-a-glance distribution. Clickable segments = filter shortcut | 2026-02-12 |
| Gradient accent top-border on repo card | Breaks card flatness. Gradient from ahead-green to thriving-blue ties to domain meaning | 2026-02-12 |
| Quick-filter chips (Meaningful/Active/All) | One-click answer for Evaluator's #1 job: "show me only forks with meaningful changes" | 2026-02-12 |
| Top-3 row left border | Visual hierarchy in the table — top forks stand out without reading numbers | 2026-02-12 |
| Larger sparklines (120x32) | 80x20 was barely visible. 120x32 with gradient fill becomes a real visual feature | 2026-02-12 |
| prefers-reduced-motion kills all | Accessibility — all animations disabled for users who prefer reduced motion | 2026-02-12 |
