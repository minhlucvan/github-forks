import { useQuery } from "@tanstack/react-query"
import { fetchAllForks } from "@/lib/github"
import type { GitHubFork } from "@/lib/github-types"

export function useForks(owner: string, repo: string, token?: string) {
  return useQuery<GitHubFork[]>({
    queryKey: ["forks", owner, repo],
    queryFn: () => fetchAllForks(owner, repo, { token }),
    enabled: Boolean(owner && repo),
    staleTime: 5 * 60 * 1000,
  })
}
