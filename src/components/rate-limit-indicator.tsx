import { useState, useEffect, useCallback } from "react"
import { Shield, ShieldAlert, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getRateLimit, onRateLimitChange } from "@/lib/rate-limit"
import { RATE_LIMIT_THRESHOLDS } from "@/lib/constants"
import type { RateLimitInfo } from "@/lib/github-types"

interface RateLimitIndicatorProps {
  token?: string
  onTokenChange: (token: string) => void
}

export function RateLimitIndicator({ token, onTokenChange }: RateLimitIndicatorProps) {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>(getRateLimit)
  const [tokenInput, setTokenInput] = useState(token ?? "")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    return onRateLimitChange(setRateLimit)
  }, [])

  const handleSaveToken = useCallback(() => {
    onTokenChange(tokenInput.trim())
    setOpen(false)
  }, [tokenInput, onTokenChange])

  const { remaining, limit } = rateLimit
  const isDanger = remaining <= RATE_LIMIT_THRESHOLDS.danger
  const isWarning = remaining <= RATE_LIMIT_THRESHOLDS.warning

  // Hidden when rate limit is healthy and authenticated
  if (!isWarning && rateLimit.isAuthenticated) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={
            isDanger
              ? "text-destructive hover:text-destructive"
              : isWarning
                ? "text-behind hover:text-behind"
                : ""
          }
        >
          {isDanger ? (
            <ShieldAlert className="size-4" />
          ) : (
            <Shield className="size-4" />
          )}
          <span className="tabular-nums text-xs">
            {remaining}/{limit}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">API Rate Limit</h4>
            <p className="text-xs text-muted-foreground">
              {rateLimit.isAuthenticated
                ? `Authenticated — ${remaining} requests remaining`
                : `Unauthenticated — ${remaining} of ${limit} requests remaining. Add a token for 5,000/hour.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Key className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              type="password"
              className="h-8 text-xs"
            />
            <Button size="sm" onClick={handleSaveToken} className="shrink-0">
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate a token at GitHub Settings &rarr; Developer settings &rarr; Personal access tokens. No scopes needed for public repos.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
