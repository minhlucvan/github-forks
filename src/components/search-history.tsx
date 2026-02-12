import { Clock, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchHistoryProps {
  history: string[]
  onSelect: (repo: string) => void
  onRemove: (repo: string) => void
  onClear: () => void
}

export function SearchHistory({ history, onSelect, onRemove, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Clock className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
          <Button variant="ghost" size="icon-xs" onClick={onClear}>
            <Trash2 className="size-3" />
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto py-1">
          {history.map((repo) => (
            <div
              key={repo}
              className="group flex items-center justify-between px-3 py-1.5 hover:bg-accent"
            >
              <button
                onClick={() => onSelect(repo)}
                className="flex-1 truncate text-left text-sm"
              >
                {repo}
              </button>
              <button
                onClick={() => onRemove(repo)}
                className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
