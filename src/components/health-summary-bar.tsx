import { useMemo } from "react"
import type { ForkScore } from "@/lib/fork-score"

type Tier = ForkScore["tier"]

interface HealthSummaryBarProps {
  scores: ForkScore[]
  onTierClick?: (tier: Tier) => void
  activeTier?: string
}

const tierConfig: Record<Tier, { label: string; className: string }> = {
  thriving: { label: "thriving", className: "bg-score-thriving" },
  active: { label: "active", className: "bg-score-active" },
  moderate: { label: "moderate", className: "bg-score-moderate" },
  low: { label: "low", className: "bg-score-low" },
  inactive: { label: "inactive", className: "bg-score-inactive" },
}

const tierOrder: Tier[] = ["thriving", "active", "moderate", "low", "inactive"]

export function HealthSummaryBar({ scores, onTierClick, activeTier }: HealthSummaryBarProps) {
  const counts = useMemo(() => {
    const map: Record<Tier, number> = { thriving: 0, active: 0, moderate: 0, low: 0, inactive: 0 }
    for (const s of scores) map[s.tier]++
    return map
  }, [scores])

  const total = scores.length
  if (total === 0) return null

  return (
    <div className="space-y-2">
      {/* Stacked bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {tierOrder.map((tier) => {
          const count = counts[tier]
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <button
              key={tier}
              className={`${tierConfig[tier].className} animate-bar-grow transition-opacity hover:opacity-80 ${activeTier && activeTier !== tier ? "opacity-40" : ""}`}
              style={{ width: `${pct}%` }}
              onClick={() => onTierClick?.(tier)}
              aria-label={`${count} ${tierConfig[tier].label} forks`}
            />
          )
        })}
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {tierOrder.map((tier) => {
          const count = counts[tier]
          if (count === 0) return null
          return (
            <button
              key={tier}
              className={`inline-flex items-center gap-1.5 transition-opacity ${activeTier && activeTier !== tier ? "opacity-40" : ""} hover:opacity-100`}
              onClick={() => onTierClick?.(tier)}
            >
              <span className={`inline-block size-2 rounded-full ${tierConfig[tier].className}`} />
              <span className="tabular-nums">{count}</span>
              <span>{tierConfig[tier].label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
