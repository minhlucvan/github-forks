import { useQuery } from "@tanstack/react-query"
import { fetchRepo } from "@/lib/github"
import type { GitHubRepo } from "@/lib/github-types"

export function useRepo(owner: string, repo: string, token?: string) {
  return useQuery<GitHubRepo>({
    queryKey: ["repo", owner, repo],
    queryFn: () => fetchRepo(owner, repo, { token }),
    enabled: Boolean(owner && repo),
    staleTime: 5 * 60 * 1000,
  })
}
