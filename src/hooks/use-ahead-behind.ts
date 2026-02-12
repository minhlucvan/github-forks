import { useQuery } from "@tanstack/react-query"
import { fetchComparison } from "@/lib/github"
import type { GitHubComparison } from "@/lib/github-types"

export function useAheadBehind(
  parentOwner: string,
  parentRepo: string,
  parentBranch: string,
  forkOwner: string,
  forkBranch: string,
  isVisible: boolean,
  token?: string
) {
  return useQuery<GitHubComparison>({
    queryKey: ["ahead-behind", parentOwner, parentRepo, forkOwner, forkBranch],
    queryFn: () =>
      fetchComparison(
        parentOwner,
        parentRepo,
        `${parentOwner}:${parentBranch}`,
        `${forkOwner}:${forkBranch}`,
        { token }
      ),
    enabled: isVisible && Boolean(parentOwner && parentRepo && forkOwner),
    staleTime: 5 * 60 * 1000,
  })
}
