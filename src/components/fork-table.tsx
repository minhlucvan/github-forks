import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ForkToolbar, defaultFilters, type FilterState } from "@/components/fork-toolbar"
import { forkColumns, type ForkRowData } from "@/components/fork-columns"
import { EmptyState } from "@/components/empty-state"
import { calculateForkScore } from "@/lib/fork-score"
import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import type { GitHubFork, GitHubComparison, GitHubCommitActivity } from "@/lib/github-types"

interface ForkTableProps {
  forks: GitHubFork[]
  comparisons: Map<string, { data?: GitHubComparison | null; isLoading: boolean }>
  activities: Map<string, { data?: GitHubCommitActivity[] | null; isLoading: boolean }>
  isLoading?: boolean
  repoName?: string
}

export function ForkTable({
  forks,
  comparisons,
  activities,
  isLoading,
  repoName,
}: ForkTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "score", desc: true },
  ])
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  // Build row data with scores
  const rowData = useMemo<ForkRowData[]>(() => {
    return forks.map((fork) => {
      const key = fork.owner.login
      const comp = comparisons.get(key)
      const act = activities.get(key)
      const score = calculateForkScore(fork, comp?.data)

      return {
        fork,
        comparison: comp?.data,
        comparisonLoading: comp?.isLoading,
        score,
        activity: act?.data,
        activityLoading: act?.isLoading,
      }
    })
  }, [forks, comparisons, activities])

  // Apply local filters
  const filteredData = useMemo(() => {
    return rowData.filter((row) => {
      if (filters.search && !row.fork.owner.login.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.language && row.fork.language !== filters.language) {
        return false
      }
      if (filters.minStars > 0 && row.fork.stargazers_count < filters.minStars) {
        return false
      }
      if (filters.healthTier && row.score.tier !== filters.healthTier) {
        return false
      }
      return true
    })
  }, [rowData, filters])

  // Collect unique languages for the filter dropdown
  const languages = useMemo(() => {
    const langs = new Set<string>()
    forks.forEach((f) => {
      if (f.language) langs.add(f.language)
    })
    return Array.from(langs).sort()
  }, [forks])

  const table = useReactTable({
    data: filteredData,
    columns: forkColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (forks.length === 0) {
    return <EmptyState variant="no-forks" />
  }

  return (
    <div className="space-y-3">
      <ForkToolbar
        forks={filteredData.map((r) => r.fork)}
        repoName={repoName}
        totalCount={forks.length}
        filteredCount={filteredData.length}
        filters={filters}
        onFiltersChange={setFilters}
        languages={languages}
      />

      {filteredData.length === 0 ? (
        <EmptyState variant="no-results" />
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
