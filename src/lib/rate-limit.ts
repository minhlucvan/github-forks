import type { RateLimitInfo } from "./github-types"

let currentRateLimit: RateLimitInfo = {
  limit: 60,
  remaining: 60,
  resetAt: 0,
  isAuthenticated: false,
}

const listeners = new Set<(info: RateLimitInfo) => void>()

export function updateRateLimit(info: RateLimitInfo): void {
  currentRateLimit = info
  listeners.forEach((fn) => fn(info))
}

export function getRateLimit(): RateLimitInfo {
  return currentRateLimit
}

export function onRateLimitChange(fn: (info: RateLimitInfo) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
