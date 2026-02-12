import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export interface FilterState {
  search: string
  language: string
  minStars: number
  healthTier: string
  quickFilter?: "meaningful" | "active" | null
}

export const defaultFilters: FilterState = {
  search: "",
  language: "",
  minStars: 0,
  healthTier: "",
  quickFilter: null,
}

interface ForkFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  languages: string[]
}

export function ForkFilters({ filters, onFiltersChange, languages }: ForkFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.language || filters.minStars > 0 || filters.healthTier

  const update = (patch: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...patch })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        placeholder="Filter by owner..."
        className="h-8 w-40 text-xs"
      />

      <Select
        value={filters.language}
        onValueChange={(v) => update({ language: v === "all" ? "" : v })}
      >
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.healthTier}
        onValueChange={(v) => update({ healthTier: v === "all" ? "" : v })}
      >
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Health" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tiers</SelectItem>
          <SelectItem value="thriving">Thriving</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={filters.minStars || ""}
        onChange={(e) => update({ minStars: Number(e.target.value) || 0 })}
        placeholder="Min stars"
        className="h-8 w-24 text-xs"
        min={0}
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(defaultFilters)}
          className="h-8 text-xs"
        >
          <X className="size-3" />
          Clear
        </Button>
      )}
    </div>
  )
}
