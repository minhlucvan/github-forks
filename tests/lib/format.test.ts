import { describe, it, expect } from "vitest"
import { formatNumber, formatRelativeDate, formatSize } from "@/lib/format"

describe("formatNumber", () => {
  it("formats numbers under 1000", () => {
    expect(formatNumber(42)).toBe("42")
    expect(formatNumber(999)).toBe("999")
  })

  it("formats thousands with K suffix", () => {
    expect(formatNumber(1_500)).toBe("1.5K")
    expect(formatNumber(10_000)).toBe("10.0K")
  })

  it("formats millions with M suffix", () => {
    expect(formatNumber(1_500_000)).toBe("1.5M")
  })
})

describe("formatSize", () => {
  it("formats KB", () => {
    expect(formatSize(500)).toBe("500 KB")
  })

  it("formats MB", () => {
    expect(formatSize(1_500)).toBe("1.5 MB")
  })

  it("formats GB", () => {
    expect(formatSize(1_500_000)).toBe("1.5 GB")
  })
})

describe("formatRelativeDate", () => {
  it("returns 'just now' for recent dates", () => {
    const now = new Date().toISOString()
    expect(formatRelativeDate(now)).toBe("just now")
  })
})
