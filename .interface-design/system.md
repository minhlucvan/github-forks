# Design System — Active Forks

## Direction

**Personality:** Precision & Density
**Foundation:** Achromatic light, GitHub-inspired cool neutral dark
**Depth:** shadow-sm + border (light), surface lightness shifts (dark)

## Intent

**Who:** Developers with a dead dependency — frustrated, scanning fast, copying a fork URL to their `package.json` in under 10 seconds.

**What they must accomplish:** Find the most active/divergent fork of a GitHub repo — grade submissions by health score, ahead/behind count, and recent activity.

**Feel:** Calm confidence. Restrained color palette. Whitespace is a feature. Color only where it carries meaning. Dense enough for power users scanning 2,000+ forks, but not cluttered.

## Signature

**GitHub-native dark mode.** The dark palette uses GitHub's own color system (#0d1117, #161b22, #1c2128, #21262d) with a subtle cool blue tint (hue 264, chroma 0.005–0.008). This creates instant recognition — our users live on GitHub. The dark mode feels like home, not like a generic template.

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
Weight: normal (400), medium (500), semibold (600)
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

### Badge (CVA variants)
Domain variants use semantic foreground tokens (not hard-coded text-white):
- `ahead`: bg-ahead text-ahead-foreground
- `behind`: bg-behind text-behind-foreground
- `identical`: bg-muted text-muted-foreground
- `thriving`: bg-score-thriving text-score-thriving-foreground
- `active`: bg-score-active text-score-active-foreground
- `moderate`: bg-score-moderate text-score-moderate-foreground
- `low`: bg-score-low text-score-low-foreground
- `inactive`: bg-score-inactive text-score-inactive-foreground

### Data Display
- Ahead/behind badges: most prominent data per row — bigger than stars, bolder than dates
- Health score: color-coded badge using --score-* tokens
- Activity sparklines: lazy-loaded, progressive reveal
- Tables: tabular-nums for numeric alignment

### Progressive Disclosure
- Layer 1: Table + sort (Refugee path)
- Layer 2: Filters + sparklines (Evaluator path)
- Layer 3: Fork tree + export (Mapper path)
- Filters collapsed by default, expanded on click

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
