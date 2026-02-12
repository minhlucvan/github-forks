import { useQuery } from "@tanstack/react-query"
import { fetchCommitActivity } from "@/lib/github"
import type { GitHubCommitActivity } from "@/lib/github-types"

export function useCommitActivity(
  owner: string,
  repo: string,
  isVisible: boolean,
  token?: string
) {
  return useQuery<GitHubCommitActivity[]>({
    queryKey: ["commit-activity", owner, repo],
    queryFn: () => fetchCommitActivity(owner, repo, { token }),
    enabled: isVisible && Boolean(owner && repo),
    staleTime: 10 * 60 * 1000,
  })
}
