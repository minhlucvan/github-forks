import { useState, useCallback } from "react"

const TOKEN_KEY = "github-forks-token"

export function useGitHubToken() {
  const [token, setTokenState] = useState<string>(() => {
    return localStorage.getItem(TOKEN_KEY) ?? ""
  })

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken)
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [])

  const clearToken = useCallback(() => {
    setTokenState("")
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  return { token: token || undefined, setToken, clearToken }
}
