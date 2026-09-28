import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderChainStatus, updateChainStatus, updateChainTvl } from "../src/components/chainStatus";
import type { ChainSnapshot } from "../src/sources/chain";
import { UNKNOWN } from "../src/format";

// GATES RULE: synthetic fixtures only, never a live RPC/DefiLlama call.
// The clock is frozen (fake timers) so block-age math is deterministic
// instead of racing the real wall clock.
const FROZEN_NOW = new Date("2026-09-28T00:00:10.000Z");
const SNAPSHOT_FIXTURE: ChainSnapshot = {
  blockNumber: 1_234_567,
  chainIdHex: "0x1237",
  gasPriceWei: 2_500_000_000n,
  baseFeeWei: 1_100_000_000n,
  gasUsed: 6_000_000,
  gasLimit: 30_000_000,
  blockTimestamp: Math.floor(FROZEN_NOW.getTime() / 1000) - 4,
  fetchedAt: FROZEN_NOW.getTime(),
};

function statValue(key: string): string | undefined {
  return document.querySelector(`[data-stat="${key}"] [data-role="value"]`)?.textContent ?? undefined;
}

describe("chain status: live fields start unknown, never fabricated", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN_NOW);
    document.body.innerHTML = `<div id="root">${renderChainStatus()}</div>`;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders static register facts immediately, live fields as em dash", () => {
    expect(statValue("chainId")).toContain("4663");
    expect(statValue("block")).toBe(UNKNOWN);
    expect(statValue("tvl")).toBe(UNKNOWN);
  });

  it("a failed RPC read leaves fields at em dash rather than guessing", () => {
    updateChainStatus(null);
    expect(statValue("block")).toBe(UNKNOWN);
  });

  it("a synthetic snapshot fixture populates block, gas, and age correctly", () => {
    updateChainStatus(SNAPSHOT_FIXTURE);
    expect(statValue("block")).toBe("#1,234,567");
    expect(statValue("gasPrice")).toBe("2.5 gwei");
    expect(statValue("gasUsed")).toBe("20% of limit");
    expect(statValue("blockAge")).toBe("4s ago");
  });

  it("TVL stays em-dash until a fixture arrives, then formats compact", () => {
    expect(statValue("tvl")).toBe(UNKNOWN);
    updateChainTvl({ tvlUsd: 1_033_000_000, fetchedAt: Date.now() });
    expect(statValue("tvl")).toMatch(/^\$1\.0\d?B$/);
  });
});
