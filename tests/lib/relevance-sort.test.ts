import { describe, it, expect } from "vitest"
import { sortByRelevance } from "@/lib/relevance-sort"
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

describe("sortByRelevance", () => {
  it("sorts forks with more stars higher", () => {
    const forks = [
      { fork: makeFork({ stargazers_count: 1 }) },
      { fork: makeFork({ stargazers_count: 100 }) },
    ]
    const sorted = sortByRelevance(forks)
    expect(sorted[0].fork.stargazers_count).toBe(100)
  })

  it("returns empty array for empty input", () => {
    expect(sortByRelevance([])).toEqual([])
  })
})
