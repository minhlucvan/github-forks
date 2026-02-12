import type { GitHubFork, GitHubComparison } from "./github-types"

interface ForkWithComparison {
  fork: GitHubFork
  comparison?: GitHubComparison | null
}

/**
 * Sort forks by relevance: ahead*0.4 + stars*0.25 + recency*0.2 + issues*0.15
 */
export function sortByRelevance(forks: ForkWithComparison[]): ForkWithComparison[] {
  return [...forks].sort((a, b) => {
    const scoreA = relevanceScore(a)
    const scoreB = relevanceScore(b)
    return scoreB - scoreA
  })
}

function relevanceScore(item: ForkWithComparison): number {
  const ahead = item.comparison?.ahead_by ?? 0
  const stars = item.fork.stargazers_count
  const daysSincePush =
    (Date.now() - new Date(item.fork.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  const recency = Math.max(0, 1 - daysSincePush / 365)
  const issues = item.fork.open_issues_count

  return (
    Math.min(ahead / 50, 1) * 0.4 +
    Math.min(stars / 100, 1) * 0.25 +
    recency * 0.2 +
    Math.min(issues / 20, 1) * 0.15
  )
}
