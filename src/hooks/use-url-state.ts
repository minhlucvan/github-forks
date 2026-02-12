import { useMemo, useCallback } from "react"
import { DEFAULT_SORT, DEFAULT_ORDER, DEFAULT_PAGE_SIZE } from "@/lib/constants"

export interface UrlState {
  repo: string
  sort: string
  order: string
  filter: string
  page: number
  perPage: number
}

export function useUrlState() {
  const state = useMemo<UrlState>(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      repo: params.get("repo") ?? "",
      sort: params.get("sort") ?? DEFAULT_SORT,
      order: params.get("order") ?? DEFAULT_ORDER,
      filter: params.get("filter") ?? "",
      page: Number(params.get("page") ?? 1),
      perPage: Number(params.get("per_page") ?? DEFAULT_PAGE_SIZE),
    }
  }, [])

  const update = useCallback((changes: Partial<UrlState>) => {
    const params = new URLSearchParams(window.location.search)
    const current: UrlState = {
      repo: params.get("repo") ?? "",
      sort: params.get("sort") ?? DEFAULT_SORT,
      order: params.get("order") ?? DEFAULT_ORDER,
      filter: params.get("filter") ?? "",
      page: Number(params.get("page") ?? 1),
      perPage: Number(params.get("per_page") ?? DEFAULT_PAGE_SIZE),
    }

    const next = { ...current, ...changes }
    const nextParams = new URLSearchParams()

    if (next.repo) nextParams.set("repo", next.repo)
    if (next.sort !== DEFAULT_SORT) nextParams.set("sort", next.sort)
    if (next.order !== DEFAULT_ORDER) nextParams.set("order", next.order)
    if (next.filter) nextParams.set("filter", next.filter)
    if (next.page > 1) nextParams.set("page", String(next.page))
    if (next.perPage !== DEFAULT_PAGE_SIZE) nextParams.set("per_page", String(next.perPage))

    window.history.replaceState(null, "", `?${nextParams}`)
  }, [])

  return { state, update }
}
