import { createColumnHelper } from "@tanstack/react-table"
import { ArrowUpDown, Star, GitFork, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AheadBehindBadge } from "@/components/ahead-behind-badge"
import { HealthScoreBadge } from "@/components/health-score-badge"
import { ActivitySparkline } from "@/components/activity-sparkline"
import { formatNumber, formatRelativeDate } from "@/lib/format"
import type { GitHubFork, GitHubComparison, GitHubCommitActivity } from "@/lib/github-types"
import type { ForkScore } from "@/lib/fork-score"

export interface ForkRowData {
  fork: GitHubFork
  comparison?: GitHubComparison | null
  comparisonLoading?: boolean
  score: ForkScore
  activity?: GitHubCommitActivity[] | null
  activityLoading?: boolean
}

const columnHelper = createColumnHelper<ForkRowData>()

export const forkColumns = [
  columnHelper.accessor("fork.owner.login", {
    id: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fork
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const { fork } = row.original
      return (
        <div className="flex items-center gap-2">
          <a
            href={fork.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {fork.owner.login}
          </a>
          <a
            href={fork.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      )
    },
  }),

  columnHelper.accessor("score.total", {
    id: "score",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Score
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <HealthScoreBadge score={row.original.score} />,
  }),

  columnHelper.display({
    id: "ahead_behind",
    header: "Ahead / Behind",
    cell: ({ row }) => (
      <AheadBehindBadge
        comparison={row.original.comparison}
        isLoading={row.original.comparisonLoading}
      />
    ),
  }),

  columnHelper.accessor("fork.stargazers_count", {
    id: "stars",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Star className="size-3.5" />
        Stars
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatNumber(getValue())}</span>
    ),
  }),

  columnHelper.accessor("fork.forks_count", {
    id: "forks",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <GitFork className="size-3.5" />
        Forks
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatNumber(getValue())}</span>
    ),
  }),

  columnHelper.display({
    id: "activity",
    header: "Activity",
    cell: ({ row }) => (
      <ActivitySparkline
        activity={row.original.activity}
        isLoading={row.original.activityLoading}
      />
    ),
  }),

  columnHelper.accessor("fork.pushed_at", {
    id: "updated",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{formatRelativeDate(getValue())}</span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.fork.pushed_at).getTime()
      const b = new Date(rowB.original.fork.pushed_at).getTime()
      return a - b
    },
  }),
]
