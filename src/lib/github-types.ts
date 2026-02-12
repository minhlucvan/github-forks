export interface GitHubRepo {
  id: number
  full_name: string
  name: string
  owner: GitHubOwner
  description: string | null
  html_url: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  topics: string[]
  license: { spdx_id: string; name: string } | null
  created_at: string
  updated_at: string
  pushed_at: string
  default_branch: string
  archived: boolean
  disabled: boolean
  size: number
}

export interface GitHubOwner {
  login: string
  avatar_url: string
  html_url: string
}

export interface GitHubFork extends GitHubRepo {
  parent?: GitHubRepo
  source?: GitHubRepo
}

export interface GitHubComparison {
  ahead_by: number
  behind_by: number
  status: "ahead" | "behind" | "identical" | "diverged"
  total_commits: number
}

export interface GitHubCommitActivity {
  week: number
  total: number
  days: number[]
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  resetAt: number
  isAuthenticated: boolean
}
