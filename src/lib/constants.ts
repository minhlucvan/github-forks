export const GITHUB_API_BASE = "https://api.github.com"

export const DEFAULT_PER_PAGE = 100

export const MAX_CONCURRENT_REQUESTS = 5

export const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const RATE_LIMIT_THRESHOLDS = {
  warning: 20,
  danger: 5,
  exhausted: 0,
} as const

export const SEARCH_HISTORY_MAX = 20

export const DEFAULT_SORT = "relevance" as const

export const DEFAULT_ORDER = "desc" as const

export const DEFAULT_PAGE_SIZE = 25
