import { useCallback, useMemo } from "react"
import { QueryClient, QueryClientProvider, useQueries } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { SearchHistory } from "@/components/search-history"
import { RepoCard } from "@/components/repo-card"
import { ForkTable } from "@/components/fork-table"
import { RateLimitIndicator } from "@/components/rate-limit-indicator"
import { EmptyState } from "@/components/empty-state"
import { useUrlState } from "@/hooks/use-url-state"
import { useRepo } from "@/hooks/use-repo"
import { useForks } from "@/hooks/use-forks"
import { useGitHubToken } from "@/hooks/use-github-token"
import { useSearchHistory } from "@/hooks/use-search-history"
import { fetchComparison, fetchCommitActivity } from "@/lib/github"
import { GitFork } from "lucide-react"
import { parseGitHubUrl } from "@/lib/url-parser"
import type { GitHubComparison, GitHubCommitActivity } from "@/lib/github-types"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function AppContent() {
  const { state, update } = useUrlState()
  const { token, setToken } = useGitHubToken()
  const { history, addEntry, removeEntry, clearHistory } = useSearchHistory()

  const parsed = useMemo(() => {
    if (!state.repo) return null
    return parseGitHubUrl(state.repo)
  }, [state.repo])

  const owner = parsed?.owner ?? ""
  const repo = parsed?.repo ?? ""

  const { data: repoData, isLoading: repoLoading, error: repoError } = useRepo(owner, repo, token)
  const { data: forks, isLoading: forksLoading } = useForks(owner, repo, token)

  const handleSearch = useCallback(
    (o: string, r: string) => {
      const repoStr = `${o}/${r}`
      update({ repo: repoStr, page: 1 })
      addEntry(repoStr)
    },
    [update, addEntry]
  )

  const handleHistorySelect = useCallback(
    (repoStr: string) => {
      const p = parseGitHubUrl(repoStr)
      if (p) handleSearch(p.owner, p.repo)
    },
    [handleSearch]
  )

  // Lazy-load comparisons for visible forks
  const forkList = forks ?? []
  const parentBranch = repoData?.default_branch ?? "main"

  const comparisonQueries = useQueries({
    queries: forkList.map((fork) => ({
      queryKey: ["ahead-behind", owner, repo, fork.owner.login, fork.default_branch],
      queryFn: () =>
        fetchComparison(
          owner,
          repo,
          `${owner}:${parentBranch}`,
          `${fork.owner.login}:${fork.default_branch}`,
          { token }
        ),
      enabled: Boolean(owner && repo && repoData),
      staleTime: 5 * 60 * 1000,
      retry: 0,
    })),
  })

  const activityQueries = useQueries({
    queries: forkList.map((fork) => ({
      queryKey: ["commit-activity", fork.owner.login, fork.name],
      queryFn: () => fetchCommitActivity(fork.owner.login, fork.name, { token }),
      enabled: Boolean(owner && repo && repoData),
      staleTime: 10 * 60 * 1000,
      retry: 0,
    })),
  })

  // Build lookup maps for the table
  const comparisons = useMemo(() => {
    const map = new Map<string, { data?: GitHubComparison | null; isLoading: boolean }>()
    forkList.forEach((fork, i) => {
      const q = comparisonQueries[i]
      map.set(fork.owner.login, {
        data: q?.data ?? null,
        isLoading: q?.isLoading ?? false,
      })
    })
    return map
  }, [forkList, comparisonQueries])

  const activities = useMemo(() => {
    const map = new Map<string, { data?: GitHubCommitActivity[] | null; isLoading: boolean }>()
    forkList.forEach((fork, i) => {
      const q = activityQueries[i]
      map.set(fork.owner.login, {
        data: q?.data ?? null,
        isLoading: q?.isLoading ?? false,
      })
    })
    return map
  }, [forkList, activityQueries])

  const hasSearched = Boolean(state.repo)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="flex items-center gap-1.5 text-lg font-semibold">
            <GitFork className="size-4 text-muted-foreground" />
            <span className="text-brand-accent">Active</span> Forks
          </h1>
          <div className="flex items-center gap-1">
            <RateLimitIndicator token={token} onTokenChange={setToken} />
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <SearchBar
            onSearch={handleSearch}
            isLoading={repoLoading || forksLoading}
            defaultValue={state.repo}
          />
          <SearchHistory
            history={history}
            onSelect={handleHistorySelect}
            onRemove={removeEntry}
            onClear={clearHistory}
          />
        </div>

        {repoError ? (
          <EmptyState
            variant="error"
            message={repoError instanceof Error ? repoError.message : "Failed to fetch repository"}
          />
        ) : hasSearched ? (
          <>
            <RepoCard
              repo={repoData}
              isLoading={repoLoading}
              forkCount={forks?.length}
            />
            <ForkTable
              forks={forkList}
              comparisons={comparisons}
              activities={activities}
              isLoading={forksLoading}
              repoName={repoData?.name}
            />
          </>
        ) : (
          <EmptyState
            variant="landing"
            onExampleClick={(repo) => {
              const [o, r] = repo.split("/")
              if (o && r) handleSearch(o, r)
            }}
          />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="github-forks-theme" attribute="class" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
