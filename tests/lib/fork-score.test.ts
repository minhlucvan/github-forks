import { describe, it, expect } from "vitest"
import { calculateForkScore } from "@/lib/fork-score"
import type { GitHubFork } from "@/lib/github-types"

function makeFork(overrides: Partial<GitHubFork> = {}): GitHubFork {
  return {
    id: 1,
    full_name: "user/repo",
    name: "repo",
    owner: { login: "user", avatar_url: "", html_url: "" },
    description: null,
    html_url: "",
    stargazers_count: 0,
    watchers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: null,
    topics: [],
    license: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    default_branch: "main",
    archived: false,
    disabled: false,
    size: 0,
    ...overrides,
  }
}

describe("calculateForkScore", () => {
  it("returns inactive tier for empty fork", () => {
    const fork = makeFork({ pushed_at: new Date(2020, 0, 1).toISOString() })
    const score = calculateForkScore(fork)
    expect(score.tier).toBe("inactive")
  })

  it("scores higher for forks with stars", () => {
    const fork = makeFork({ stargazers_count: 100 })
    const score = calculateForkScore(fork)
    expect(score.total).toBeGreaterThan(0)
  })

  it("considers ahead_by in scoring", () => {
    const fork = makeFork()
    const scoreWithout = calculateForkScore(fork)
    const scoreWith = calculateForkScore(fork, { ahead_by: 50, behind_by: 0, status: "ahead", total_commits: 50 })
    expect(scoreWith.total).toBeGreaterThan(scoreWithout.total)
  })
})
