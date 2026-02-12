# Design System — Active Forks

## Direction

**Personality:** Precision & Density
**Foundation:** Cool neutral (achromatic oklch)
**Depth:** Subtle shadows + borders (shadow-sm on cards, border-based separation)

## Intent

**Who:** Developers with a dead dependency — frustrated, scanning fast, copying a fork URL to their `package.json` in under 10 seconds.

**What they must accomplish:** Find the most active/divergent fork of a GitHub repo — grade submissions by health score, ahead/behind count, and recent activity.

**Feel:** Calm confidence. Restrained color palette. Whitespace is a feature. Color only where it carries meaning. Dense enough for power users scanning 2,000+ forks, but not cluttered.

## Tokens

### Spacing
Base: 4px (Tailwind default)
Scale: 4, 8, 12, 16, 24, 32, 48, 64 (via Tailwind spacing utilities)

### Colors
Color model: oklch

```
--background: oklch(1 0 0)              /* pure white canvas */
--foreground: oklch(0.145 0 0)          /* near-black text */
--card: oklch(1 0 0)                    /* same as background */
--card-foreground: oklch(0.145 0 0)
--primary: oklch(0.205 0 0)            /* near-black for primary actions */
--primary-foreground: oklch(0.985 0 0)
--secondary: oklch(0.97 0 0)           /* barely-off-white */
--muted-foreground: oklch(0.556 0 0)   /* medium gray for metadata */
--border: oklch(0.922 0 0)             /* very light gray borders */
--destructive: oklch(0.577 0.245 27.325)
```

Domain-specific semantic colors:
```
--ahead: oklch(0.65 0.19 160)          /* green — commits ahead */
--behind: oklch(0.70 0.15 65)          /* amber — commits behind */
--score-thriving: oklch(0.62 0.19 255) /* blue — top health */
--score-active: oklch(0.65 0.19 160)   /* green — active */
--score-moderate: oklch(0.70 0.15 65)  /* amber — moderate */
--score-low: oklch(0.65 0.20 35)       /* orange — low */
--score-inactive: oklch(0.55 0 0)      /* gray — dead */
```

Dark mode inverts lightness; borders use alpha transparency (`oklch(1 0 0 / 10%)`).

### Radius
```
--radius: 0.625rem (10px)
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 10px
--radius-xl: 14px
```

### Typography
Font: system-ui (Tailwind default — fast, native)
Text hierarchy via shadcn tokens: foreground → secondary-foreground → muted-foreground
Weight: normal (400), medium (500), semibold (600)

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
- Shadow: shadow-sm
- Radius: rounded-xl
- Padding: py-6, content px-6
- Compound: Card > CardHeader > CardTitle + CardDescription + CardAction > CardContent > CardFooter

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
| Achromatic neutrals | Calm confidence — color reserved for meaning (ahead/behind/health) | 2026-02-12 |
| shadow-sm + border depth | Dense data tool — subtle lift without visual weight | 2026-02-12 |
| Domain-specific tokens (ahead, behind, score-*) | Fork health is the core data — deserves first-class color tokens | 2026-02-12 |
| Progressive disclosure (3 layers) | Three user segments with different depth needs | 2026-02-12 |
| shadcn/ui + Tailwind v4 + Radix | Accessible primitives, consistent tokens, fast iteration | 2026-02-12 |
