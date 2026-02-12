import { useState, useCallback } from "react"
import { SEARCH_HISTORY_MAX } from "@/lib/constants"

const HISTORY_KEY = "github-forks-search-history"

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addEntry = useCallback((repo: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r !== repo)
      const next = [repo, ...filtered].slice(0, SEARCH_HISTORY_MAX)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeEntry = useCallback((repo: string) => {
    setHistory((prev) => {
      const next = prev.filter((r) => r !== repo)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  return { history, addEntry, removeEntry, clearHistory }
}
