import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { ForkScore } from "@/lib/fork-score"

interface HealthScoreBadgeProps {
  score: ForkScore
}

export function HealthScoreBadge({ score }: HealthScoreBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={score.tier} className="tabular-nums cursor-default">
          {score.total}
        </Badge>
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
