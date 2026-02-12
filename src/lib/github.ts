import { GITHUB_API_BASE, DEFAULT_PER_PAGE, MAX_CONCURRENT_REQUESTS } from "./constants"
import type { GitHubRepo, GitHubFork, GitHubComparison, GitHubCommitActivity, RateLimitInfo } from "./github-types"
import { updateRateLimit } from "./rate-limit"

interface FetchOptions {
  token?: string
  signal?: AbortSignal
}

function buildHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

function parseLinkHeader(header: string | null): number {
  if (!header) return 1
  const match = header.match(/page=(\d+)>; rel="last"/)
  return match ? parseInt(match[1], 10) : 1
}

function extractRateLimit(headers: Headers): RateLimitInfo {
  return {
    limit: parseInt(headers.get("X-RateLimit-Limit") ?? "60", 10),
    remaining: parseInt(headers.get("X-RateLimit-Remaining") ?? "60", 10),
    resetAt: parseInt(headers.get("X-RateLimit-Reset") ?? "0", 10),
    isAuthenticated: parseInt(headers.get("X-RateLimit-Limit") ?? "60", 10) > 60,
  }
}

async function githubFetch<T>(path: string, options: FetchOptions = {}): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: buildHeaders(options.token),
    signal: options.signal,
  })

  const rateLimit = extractRateLimit(response.headers)
  updateRateLimit(rateLimit)

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return { data: data as T, headers: response.headers }
}

export async function fetchRepo(owner: string, repo: string, options?: FetchOptions): Promise<GitHubRepo> {
  const { data } = await githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`, options)
  return data
}

export async function fetchForks(
  owner: string,
  repo: string,
  page = 1,
  options?: FetchOptions
): Promise<{ data: GitHubFork[]; totalPages: number }> {
  const { data, headers } = await githubFetch<GitHubFork[]>(
    `/repos/${owner}/${repo}/forks?per_page=${DEFAULT_PER_PAGE}&page=${page}&sort=stargazers`,
    options
  )
  return { data, totalPages: parseLinkHeader(headers.get("Link")) }
}

async function promisePool<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = []
  const executing = new Set<Promise<void>>()

  for (const task of tasks) {
    const p = task().then((result) => {
      results.push(result)
      executing.delete(p)
    })
    executing.add(p)
    if (executing.size >= concurrency) {
      await Promise.race(executing)
    }
  }
  await Promise.all(executing)
  return results
}

export async function fetchAllForks(
  owner: string,
  repo: string,
  options?: FetchOptions
): Promise<GitHubFork[]> {
  const first = await fetchForks(owner, repo, 1, options)
  if (first.totalPages <= 1) return first.data

  const remainingPages = Array.from(
    { length: first.totalPages - 1 },
    (_, i) => i + 2
  )

  const pages = await promisePool(
    remainingPages.map((page) => () => fetchForks(owner, repo, page, options)),
    MAX_CONCURRENT_REQUESTS
  )

  return [first.data, ...pages.map((p) => p.data)].flat()
}

export async function fetchComparison(
  owner: string,
  repo: string,
  base: string,
  head: string,
  options?: FetchOptions
): Promise<GitHubComparison> {
  const { data } = await githubFetch<GitHubComparison>(
    `/repos/${owner}/${repo}/compare/${base}...${head}`,
    options
  )
  return data
}

export async function fetchCommitActivity(
  owner: string,
  repo: string,
  options?: FetchOptions
): Promise<GitHubCommitActivity[]> {
  const { data } = await githubFetch<GitHubCommitActivity[]>(
    `/repos/${owner}/${repo}/stats/commit_activity`,
    options
  )
  return data
}
