import { describe, expect, it } from "vitest";
import { fmtAgeSeconds, fmtCompactUsd, fmtGwei, fmtNumber, fmtPercent, fmtUsd, truncateAddress, UNKNOWN } from "../src/format";

describe("format: never fabricate, always em-dash for unknown", () => {
  it("falls back to the em dash for every missing/invalid value", () => {
    expect(fmtNumber(undefined)).toBe(UNKNOWN);
    expect(fmtCompactUsd(null)).toBe(UNKNOWN);
    expect(fmtUsd(NaN)).toBe(UNKNOWN);
    expect(fmtGwei(null)).toBe(UNKNOWN);
    expect(fmtAgeSeconds(undefined)).toBe(UNKNOWN);
    expect(fmtAgeSeconds(-5)).toBe(UNKNOWN);
    expect(truncateAddress(null)).toBe(UNKNOWN);
  });

  it("formats compact USD and signs percentages", () => {
    expect(fmtCompactUsd(1_033_000_000)).toMatch(/^\$1\.0\d?B$/);
    expect(fmtPercent(3.8)).toBe("+3.80%");
    expect(fmtPercent(-3.8)).toBe("-3.80%");
  });

  it("converts wei to gwei and formats block age", () => {
    expect(fmtGwei(1_500_000_000n)).toBe("1.5 gwei");
    expect(fmtAgeSeconds(4)).toBe("4s ago");
    expect(fmtAgeSeconds(125)).toBe("2m ago");
  });

  it("truncates a long address but leaves a short string alone", () => {
    expect(truncateAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234…5678");
    expect(truncateAddress("short")).toBe("short");
  });
});
