import { describe, it, expect } from "vitest"
import { parseGitHubUrl } from "@/lib/url-parser"

describe("parseGitHubUrl", () => {
  it("parses owner/repo format", () => {
    expect(parseGitHubUrl("facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    })
  })

  it("parses full GitHub URL", () => {
    expect(parseGitHubUrl("https://github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    })
  })

  it("parses GitHub URL with path", () => {
    expect(parseGitHubUrl("https://github.com/facebook/react/tree/main")).toEqual({
      owner: "facebook",
      repo: "react",
    })
  })

  it("parses URL without protocol", () => {
    expect(parseGitHubUrl("github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    })
  })

  it("returns null for invalid input", () => {
    expect(parseGitHubUrl("not-a-repo")).toBeNull()
  })

  it("returns null for non-GitHub URLs", () => {
    expect(parseGitHubUrl("https://gitlab.com/user/repo")).toBeNull()
  })

  it("trims whitespace", () => {
    expect(parseGitHubUrl("  facebook/react  ")).toEqual({
      owner: "facebook",
      repo: "react",
    })
  })
})
