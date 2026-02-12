import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { ForkScore } from "@/lib/fork-score"

interface HealthScoreBadgeProps {
  score: ForkScore
}

const tierColors: Record<ForkScore["tier"], string> = {
  thriving: "stroke-score-thriving",
  active: "stroke-score-active",
  moderate: "stroke-score-moderate",
  low: "stroke-score-low",
  inactive: "stroke-score-inactive",
}

const tierTextColors: Record<ForkScore["tier"], string> = {
  thriving: "text-score-thriving",
  active: "text-score-active",
  moderate: "text-score-moderate",
  low: "text-score-low",
  inactive: "text-score-inactive",
}

// Ring geometry
const SIZE = 24
const STROKE = 2.5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function HealthScoreBadge({ score }: HealthScoreBadgeProps) {
  const pct = Math.max(0, Math.min(100, score.total))
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-default">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="shrink-0 -rotate-90"
            aria-hidden="true"
          >
            {/* Background track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              className="stroke-muted"
              strokeWidth={STROKE}
            />
            {/* Score arc */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              className={`${tierColors[score.tier]} transition-[stroke-dashoffset] duration-500 ease-out`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <span className={`tabular-nums text-sm font-bold ${tierTextColors[score.tier]}`}>
            {score.total}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {score.tier}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
          <span className="text-muted-foreground">Ahead</span>
          <span className="tabular-nums text-right">{Math.round(score.breakdown.aheadScore)}</span>
          <span className="text-muted-foreground">Stars</span>
          <span className="tabular-nums text-right">{Math.round(score.breakdown.starsScore)}</span>
          <span className="text-muted-foreground">Recency</span>
          <span className="tabular-nums text-right">{Math.round(score.breakdown.recencyScore)}</span>
          <span className="text-muted-foreground">Issues</span>
          <span className="tabular-nums text-right">{Math.round(score.breakdown.issuesScore)}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
