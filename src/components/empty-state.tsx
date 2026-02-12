import { GitFork, SearchX, AlertCircle, ArrowUpDown, Activity, BarChart3, Sparkles } from "lucide-react"

type EmptyVariant = "landing" | "no-forks" | "no-results" | "error"

interface EmptyStateProps {
  variant: EmptyVariant
  message?: string
  onExampleClick?: (repo: string) => void
}

const EXAMPLE_REPOS = [
  "facebook/react",
  "torvalds/linux",
  "microsoft/vscode",
  "vuejs/vue",
]

const config: Record<
  Exclude<EmptyVariant, "landing">,
  { icon: React.ElementType; title: string; description: string }
> = {
  "no-forks": {
    icon: GitFork,
    title: "This repository hasn't been forked yet",
    description: "You're looking at the one and only version.",
  },
  "no-results": {
    icon: SearchX,
    title: "No forks match your filters",
    description: "Try adjusting your filter criteria or clearing all filters.",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "Failed to fetch repository data. Check the URL and try again.",
  },
}

export function EmptyState({ variant, message, onExampleClick }: EmptyStateProps) {
  if (variant === "landing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Find the{" "}
          <span className="bg-gradient-to-r from-brand-accent to-score-thriving bg-clip-text text-transparent">
            best
          </span>{" "}
          fork
        </h2>
        <p className="mt-2 text-muted-foreground">
          of any GitHub repository
        </p>

        {/* Example repo chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo}
              onClick={() => onExampleClick?.(repo)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {repo}
            </button>
          ))}
        </div>

        {/* Feature bullets */}
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-left text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 shrink-0 text-ahead" />
            Ahead/behind commits
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 shrink-0 text-score-thriving" />
            Health scores
          </div>
          <div className="flex items-center gap-2">
            <Activity className="size-4 shrink-0 text-brand-accent" />
            Activity sparklines
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-behind" />
            Smart ranking
          </div>
        </div>
      </div>
    )
  }

  const { icon: Icon, title, description } = config[variant]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h2 className="text-base font-medium">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {message || description}
      </p>
    </div>
  )
}
