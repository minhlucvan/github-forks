import { Download, FileJson, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export"
import type { GitHubFork } from "@/lib/github-types"

interface ExportMenuProps {
  forks: GitHubFork[]
  repoName?: string
}

export function ExportMenu({ forks, repoName = "forks" }: ExportMenuProps) {
  const handleCSV = () => {
    const csv = exportToCSV(forks)
    downloadFile(csv, `${repoName}-forks.csv`, "text/csv")
  }

  const handleJSON = () => {
    const json = exportToJSON(forks)
    downloadFile(json, `${repoName}-forks.json`, "application/json")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={forks.length === 0}>
          <Download />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCSV}>
          <FileSpreadsheet />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleJSON}>
          <FileJson />
          Export JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
