import type { GitHubFork, GitHubComparison } from "./github-types"

export interface ForkScore {
  total: number
  breakdown: {
    aheadScore: number
    starsScore: number
    recencyScore: number
    issuesScore: number
  }
  tier: "thriving" | "active" | "moderate" | "low" | "inactive"
}

/**
 * Calculate a health score for a fork (0-100).
 * Weights: ahead*0.4 + stars*0.25 + recency*0.2 + issues*0.15
 */
export function calculateForkScore(
  fork: GitHubFork,
  comparison?: GitHubComparison | null
): ForkScore {
  const aheadScore = comparison
    ? Math.min(comparison.ahead_by / 50, 1) * 100
    : 0

  const starsScore = Math.min(fork.stargazers_count / 100, 1) * 100

  const daysSincePush = (Date.now() - new Date(fork.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(0, 100 - daysSincePush / 3.65)

  const issuesScore = Math.min(fork.open_issues_count / 20, 1) * 100

  const total = Math.round(
    aheadScore * 0.4 + starsScore * 0.25 + recencyScore * 0.2 + issuesScore * 0.15
  )

  const tier = total >= 80 ? "thriving"
    : total >= 60 ? "active"
    : total >= 40 ? "moderate"
    : total >= 20 ? "low"
    : "inactive"

  return {
    total,
    breakdown: { aheadScore, starsScore, recencyScore, issuesScore },
    tier,
  }
}
