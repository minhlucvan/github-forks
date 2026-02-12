import { GitFork, SearchX, AlertCircle } from "lucide-react"

type EmptyVariant = "landing" | "no-forks" | "no-results" | "error"

interface EmptyStateProps {
  variant: EmptyVariant
  message?: string
}

const config: Record<EmptyVariant, { icon: React.ElementType; title: string; description: string }> = {
  landing: {
    icon: GitFork,
    title: "Find the most active fork",
    description: "Paste a GitHub URL or type owner/repo to discover which forks are thriving.",
  },
  "no-forks": {
    icon: GitFork,
    title: "No forks found",
    description: "This repository doesn't have any forks yet.",
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

export function EmptyState({ variant, message }: EmptyStateProps) {
  const { icon: Icon, title, description } = config[variant]

  if (variant === "landing") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GitFork className="mb-3 size-8 text-muted-foreground/60" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground/60">
          e.g. <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">facebook/react</code>
        </p>
      </div>
    )
  }

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
