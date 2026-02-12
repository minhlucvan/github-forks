/**
 * Parse a GitHub URL or owner/repo string into { owner, repo }.
 * Supports:
 *   - "facebook/react"
 *   - "https://github.com/facebook/react"
 *   - "https://github.com/facebook/react/tree/main"
 *   - "github.com/facebook/react"
 */
export function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim()

  // Try owner/repo format
  const simpleMatch = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/)
  if (simpleMatch) {
    return { owner: simpleMatch[1], repo: simpleMatch[2] }
  }

  // Try URL format
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      return null
    }
    const parts = url.pathname.split("/").filter(Boolean)
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] }
    }
  } catch {
    // Not a valid URL
  }

  return null
}
