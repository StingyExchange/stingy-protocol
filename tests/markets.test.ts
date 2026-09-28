import { beforeEach, describe, expect, it } from "vitest";
import { filterTokens, renderStocksSection, sortTrending, updateStocks } from "../src/components/markets";
import { sparklinePath } from "../src/components/sparkline";
import type { MarketToken } from "../src/sources/coingecko";

// Synthetic fixtures only: never a live CoinGecko call.
const mk = (id: string, symbol: string, change: number | null, vol: number): MarketToken => ({
  id, symbol, name: `${symbol} \u2022 Robinhood Token`, image: "https://example.invalid/x.png",
  price: 10, changePct24h: change, marketCap: 1_000_000, volume24h: vol, spark: [1, 2, 3, 2, 4],
});
const FIXTURES = [mk("a", "AAA", 5, 100), mk("b", "BBB", -8, 300), mk("c", "CCC", null, 200)];

describe("markets: synthetic fixtures, unavailable is never fabricated", () => {
  beforeEach(() => {
    document.body.innerHTML = renderStocksSection();
  });

  it("starts with skeleton placeholders and no numbers", () => {
    expect(document.getElementById("stocks-grid")!.querySelectorAll(".token-card--skeleton").length).toBe(8);
  });

  it("a null result shows an explicit unavailable state", () => {
    updateStocks(null);
    expect(document.getElementById("stocks-grid")!.textContent).toContain("unavailable");
  });

  it("a fixture page hydrates cards, count pill and sparkline", () => {
    updateStocks({ tokens: FIXTURES, total: 195 });
    const grid = document.getElementById("stocks-grid")!;
    expect(grid.dataset.hydrated).toBe("true");
    expect(grid.querySelectorAll(".token-card").length).toBe(3);
    expect(document.getElementById("stocks-pills")!.textContent).toContain("195");
    expect(grid.querySelector("svg.spark")).not.toBeNull();
  });

  it("sorts gainers/losers, drops unknown change, filters by ticker, and refuses to draw a lone point", () => {
    expect(sortTrending(FIXTURES, "gainers").map((t) => t.symbol)).toEqual(["AAA", "BBB"]);
    expect(sortTrending(FIXTURES, "losers")[0].symbol).toBe("BBB");
    expect(sortTrending(FIXTURES, "volume")[0].symbol).toBe("BBB");
    expect(filterTokens(FIXTURES, "cc").length).toBe(1);
    expect(sparklinePath([5], 100, 30)).toBe("");
    expect(sparklinePath([1, 2, 3], 100, 30)).toMatch(/^M/);
  });
});
