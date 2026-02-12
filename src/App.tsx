import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="github-forks-theme" attribute="class" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <h1 className="text-lg font-semibold">GitHub Forks Explorer</h1>
                <ModeToggle />
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-6">
              {/* Search, repo card, and fork table will be composed here */}
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
