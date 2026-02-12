import { Star, GitFork, Eye, ExternalLink, CircleDot, Scale } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber, formatRelativeDate } from "@/lib/format"
import type { GitHubRepo } from "@/lib/github-types"

interface RepoCardProps {
  repo?: GitHubRepo | null
  isLoading?: boolean
  forkCount?: number
}

export function RepoCard({ repo, isLoading, forkCount }: RepoCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!repo) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="truncate">{repo.full_name}</span>
          {repo.archived && (
            <Badge variant="secondary" className="text-xs">
              archived
            </Badge>
          )}
        </CardTitle>
        {repo.description && (
          <CardDescription className="line-clamp-2">{repo.description}</CardDescription>
        )}
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              GitHub
            </a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1 text-foreground">
            <Star className="size-3.5 text-muted-foreground" />
            <span className="tabular-nums font-medium">{formatNumber(repo.stargazers_count)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-foreground">
            <GitFork className="size-3.5 text-muted-foreground" />
            <span className="tabular-nums font-medium">{formatNumber(forkCount ?? repo.forks_count)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Eye className="size-3.5" />
            <span className="tabular-nums">{formatNumber(repo.watchers_count)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CircleDot className="size-3.5" />
            <span className="tabular-nums">{formatNumber(repo.open_issues_count)}</span>
          </span>
          {repo.language && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <span className="size-2.5 rounded-full bg-muted-foreground/40" />
              {repo.language}
            </span>
          )}
          {repo.license && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Scale className="size-3.5" />
              {repo.license.spdx_id}
            </span>
          )}
          <span className="text-muted-foreground">Updated {formatRelativeDate(repo.pushed_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
