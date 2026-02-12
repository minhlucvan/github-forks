import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ForkFilters, type FilterState, defaultFilters } from "@/components/fork-filters"
import { ExportMenu } from "@/components/export-menu"
import type { GitHubFork } from "@/lib/github-types"

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filtersOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
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
