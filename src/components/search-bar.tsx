import { useState, useCallback, useRef, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parseGitHubUrl } from "@/lib/url-parser"

interface SearchBarProps {
  onSearch: (owner: string, repo: string) => void
  isLoading?: boolean
  defaultValue?: string
}

export function SearchBar({ onSearch, isLoading, defaultValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const submit = useCallback(
    (input: string) => {
      const trimmed = input.trim()
      if (!trimmed) return

      const parsed = parseGitHubUrl(trimmed)
      if (!parsed) {
        setError("Enter a valid GitHub URL or owner/repo")
        return
      }

      setError("")
      onSearch(parsed.owner, parsed.repo)
    },
    [onSearch]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(value)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text")
    if (parseGitHubUrl(pasted)) {
      e.preventDefault()
      setValue(pasted)
      submit(pasted)
    }
  }

  const handleClear = () => {
    setValue("")
    setError("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError("")
            }}
            onPaste={handlePaste}
            placeholder="facebook/react or https://github.com/facebook/react"
            className="pl-9 pr-9"
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
            autoFocus
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="default" disabled={isLoading || !value.trim()}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Search"}
        </Button>
      </div>
      {error && (
        <p id="search-error" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
