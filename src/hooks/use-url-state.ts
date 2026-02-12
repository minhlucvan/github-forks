import { useState, useCallback } from "react"
import { DEFAULT_SORT, DEFAULT_ORDER, DEFAULT_PAGE_SIZE } from "@/lib/constants"

export interface UrlState {
  repo: string
  sort: string
  order: string
  filter: string
  page: number
  perPage: number
}

function readFromUrl(): UrlState {
  const params = new URLSearchParams(window.location.search)
  return {
    repo: params.get("repo") ?? "",
    sort: params.get("sort") ?? DEFAULT_SORT,
    order: params.get("order") ?? DEFAULT_ORDER,
    filter: params.get("filter") ?? "",
    page: Number(params.get("page") ?? 1),
    perPage: Number(params.get("per_page") ?? DEFAULT_PAGE_SIZE),
  }
}

function writeToUrl(state: UrlState) {
  const params = new URLSearchParams()

  if (state.repo) params.set("repo", state.repo)
  if (state.sort !== DEFAULT_SORT) params.set("sort", state.sort)
  if (state.order !== DEFAULT_ORDER) params.set("order", state.order)
  if (state.filter) params.set("filter", state.filter)
  if (state.page > 1) params.set("page", String(state.page))
  if (state.perPage !== DEFAULT_PAGE_SIZE) params.set("per_page", String(state.perPage))

  const qs = params.toString()
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
}

export function useUrlState() {
  const [state, setState] = useState<UrlState>(readFromUrl)

  const update = useCallback((changes: Partial<UrlState>) => {
    setState((prev) => {
      const next = { ...prev, ...changes }
      writeToUrl(next)
      return next
    })
  }, [])

  return { state, update }
}
