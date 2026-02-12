import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { GitHubComparison } from "@/lib/github-types"

interface AheadBehindBadgeProps {
  comparison?: GitHubComparison | null
  isLoading?: boolean
}

export function AheadBehindBadge({ comparison, isLoading }: AheadBehindBadgeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    )
  }

  if (!comparison) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  if (comparison.status === "identical" || (comparison.ahead_by === 0 && comparison.behind_by === 0)) {
    return (
      <Badge variant="identical">
        <span className="text-xs">·</span> identical
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {comparison.ahead_by > 0 ? (
        <Badge variant="ahead" className="tabular-nums font-semibold">
          ↑{comparison.ahead_by}
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">· even</span>
      )}
      {comparison.behind_by > 0 ? (
        <Badge variant="behind" className="tabular-nums">
          ↓{comparison.behind_by}
        </Badge>
      ) : comparison.ahead_by > 0 ? (
        <span className="text-xs text-muted-foreground">· even</span>
      ) : null}
    </div>
  )
}
