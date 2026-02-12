import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { GitHubCommitActivity } from "@/lib/github-types"

interface ActivitySparklineProps {
  activity?: GitHubCommitActivity[] | null
  isLoading?: boolean
  width?: number
  height?: number
}

export function ActivitySparkline({
  activity,
  isLoading,
  width = 120,
  height = 32,
}: ActivitySparklineProps) {
  const points = useMemo(() => {
    if (!activity || activity.length === 0) return null

    const recent = activity.slice(-12)
    const totals = recent.map((w) => w.total)
    const max = Math.max(...totals, 1)

    const padding = 2
    const innerWidth = width - padding * 2
    const innerHeight = height - padding * 2

    return totals.map((total, i) => ({
      x: padding + (i / (totals.length - 1)) * innerWidth,
      y: padding + innerHeight - (total / max) * innerHeight,
    }))
  }, [activity, width, height])

  if (isLoading) {
    return <Skeleton className="rounded" style={{ width, height }} />
  }

  if (!points) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`

  const gradientId = `sparkline-grad-${useMemo(() => Math.random().toString(36).slice(2, 8), [])}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-label="Commit activity"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="[stop-color:var(--color-ahead)]" stopOpacity={0.2} />
          <stop offset="100%" className="[stop-color:var(--color-ahead)]" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        className="stroke-ahead/70"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
