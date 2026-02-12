import type { GitHubFork } from "./github-types"

export function exportToCSV(forks: GitHubFork[]): string {
  const headers = [
    "Full Name",
    "Owner",
    "Stars",
    "Forks",
    "Open Issues",
    "Language",
    "Last Pushed",
    "Created",
    "URL",
  ]

  const rows = forks.map((fork) => [
    fork.full_name,
    fork.owner.login,
    fork.stargazers_count,
    fork.forks_count,
    fork.open_issues_count,
    fork.language ?? "",
    fork.pushed_at,
    fork.created_at,
    fork.html_url,
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  return csvContent
}

export function exportToJSON(forks: GitHubFork[]): string {
  return JSON.stringify(forks, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
