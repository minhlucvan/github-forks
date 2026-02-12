import { useState, useMemo } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ForkFilters, type FilterState, defaultFilters } from "@/components/fork-filters"
import { ExportMenu } from "@/components/export-menu"
import type { GitHubFork } from "@/lib/github-types"

type QuickFilter = "all" | "meaningful" | "active"

interface ForkToolbarProps {
  forks: GitHubFork[]
  repoName?: string
  totalCount: number
  filteredCount: number
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  languages: string[]
}

export function ForkToolbar({
  forks,
  repoName,
  totalCount,
  filteredCount,
  filters,
  onFiltersChange,
  languages,
}: ForkToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasActiveFilters =
    filters.search || filters.language || filters.minStars > 0 || filters.healthTier

  // Determine which quick-filter is active based on current filter state
  const activeQuick = useMemo<QuickFilter | null>(() => {
    if (!hasActiveFilters && !filters.quickFilter) return "all"
    return filters.quickFilter ?? null
  }, [hasActiveFilters, filters.quickFilter])

  const handleQuickFilter = (qf: QuickFilter) => {
    if (qf === "all") {
      onFiltersChange({ ...defaultFilters })
      return
    }
    if (qf === "meaningful") {
      onFiltersChange({
        ...defaultFilters,
        minStars: 1,
        quickFilter: "meaningful",
      })
      return
    }
    if (qf === "active") {
      onFiltersChange({
        ...defaultFilters,
        quickFilter: "active",
      })
      return
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Quick-filter chips */}
          <div className="flex items-center gap-1">
            {(["all", "meaningful", "active"] as const).map((qf) => (
              <button
                key={qf}
                onClick={() => handleQuickFilter(qf)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  activeQuick === qf
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {qf}
              </button>
            ))}
          </div>

          <Button
            variant={filtersOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-brand-accent text-[10px] text-brand-accent-foreground">
                !
              </span>
            )}
          </Button>

          <span className="text-xs text-muted-foreground tabular-nums">
            {filteredCount === totalCount
              ? `${totalCount} forks`
              : `${filteredCount} of ${totalCount} forks`}
          </span>
        </div>
        <ExportMenu forks={forks} repoName={repoName} />
      </div>
      {filtersOpen && (
        <ForkFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          languages={languages}
        />
      )}
    </div>
  )
}

export { defaultFilters }
export type { FilterState }
