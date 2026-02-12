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
  width = 80,
  height = 20,
}: ActivitySparklineProps) {
  const points = useMemo(() => {
    if (!activity || activity.length === 0) return null

    // Take last 12 weeks
    const recent = activity.slice(-12)
    const totals = recent.map((w) => w.total)
    const max = Math.max(...totals, 1)

    const padding = 1
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
    return <span className="text-xs text-muted-foreground">-</span>
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-label="Commit activity"
    >
      <path d={areaD} className="fill-ahead/15" />
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
