import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { useForks } from "@/hooks/use-forks"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatRelativeDate } from "@/lib/format"
import type { GitHubFork } from "@/lib/github-types"

interface ForkTreeRowProps {
  fork: GitHubFork
  colSpan: number
  depth?: number
  token?: string
}

export function ForkTreeRow({ fork, colSpan, depth = 1, token }: ForkTreeRowProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: subForks, isLoading } = useForks(
    fork.owner.login,
    fork.name,
    token
  )

  const hasSubForks = fork.forks_count > 0

  if (!hasSubForks && !expanded) return null

  return (
    <>
      {expanded && isLoading && (
        <TableRow>
          <TableCell colSpan={colSpan}>
            <div className="flex items-center gap-2" style={{ paddingLeft: depth * 24 }}>
              <Skeleton className="h-4 w-full max-w-xs" />
            </div>
          </TableCell>
        </TableRow>
      )}
      {expanded &&
        subForks?.map((subFork) => (
          <TableRow key={subFork.id}>
            <TableCell colSpan={colSpan}>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ paddingLeft: depth * 24 }}
              >
                {subFork.forks_count > 0 && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <ChevronRight className="size-3" />
                  </Button>
                )}
                <a
                  href={subFork.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {subFork.owner.login}
                </a>
                <span className="text-muted-foreground tabular-nums">
                  {formatNumber(subFork.stargazers_count)} stars
                </span>
                <span className="text-muted-foreground">
                  {formatRelativeDate(subFork.pushed_at)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  )
}

// Standalone expand toggle for use in table cells
interface ExpandToggleProps {
  fork: GitHubFork
  expanded: boolean
  onToggle: () => void
}

export function ForkExpandToggle({ fork, expanded, onToggle }: ExpandToggleProps) {
  if (fork.forks_count === 0) return <span className="inline-block w-6" />

  return (
    <Button variant="ghost" size="icon-xs" onClick={onToggle}>
      <ChevronRight
        className={`size-3 transition-transform ${expanded ? "rotate-90" : ""}`}
      />
    </Button>
  )
}
