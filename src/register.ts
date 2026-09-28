// Every external fact lives here as exactly one record. STANDING RULE 1.
// State is one of: "stated" (we have a confirmed value), "absent" (known to
// not exist yet), or "unconfirmed" (claimed somewhere but not verified).
// Nothing outside this file should hardcode an external fact.

export type FactState = "stated" | "absent" | "unconfirmed";

export interface Fact<T> {
  readonly state: FactState;
  readonly value: T | null;
  readonly source: string;
  readonly asOf: string | null;
}

function stated<T>(value: T, source: string, asOf: string): Fact<T> {
  return { state: "stated", value, source, asOf };
}

function absent<T>(source: string): Fact<T> {
  return { state: "absent", value: null, source, asOf: null };
}

export const register = {
  chainName: stated<string>(
    "Robinhood Chain",
    "client statement 2026-09-02, batch-level",
    "2026-09-02",
  ),
  chainIdHex: stated<string>(
    "0x1237",
    "client statement 2026-09-02, batch-level",
    "2026-09-02",
  ),
  chainIdDec: stated<number>(
    4663,
    "client statement 2026-09-02, batch-level",
    "2026-09-02",
  ),
  rpcUrl: stated<string>(
    "https://rpc.mainnet.chain.robinhood.com",
    "client statement 2026-09-02, batch-level",
    "2026-09-02",
  ),

  // The token contract has no address yet. Both gate branches (absent /
  // stated) must render correctly from day one — see gates/ca.test.ts.
  contractAddress: absent<string>("not issued as of build time"),

  // Socials: URL is the only thing ever stored here. Handles are derived,
  // never typed by hand (STANDING RULE 2).
  socialX: absent<string>("no account announced"),
  socialGithub: absent<string>("no account announced"),

  siteDomain: stated<string>(
    "stingy.exchange",
    "client brief 2026-09-28; printed on brand artwork",
    "2026-09-28",
  ),
  // Venues named on the client's cover artwork (reference/SAMPUL STINGY).
  routeVenues: stated<readonly string[]>(
    ["Uniswap v4", "KyberSwap", "Nordstern", "0x"],
    "reference/SAMPUL STINGY JPG.jpg.jpeg route diagram",
    "2026-09-28",
  ),
  // Explorer base is used only to derive a Holders link once a CA is stated.
  explorerBase: stated<string>(
    "https://robinhoodchain.blockscout.com",
    "observed in a live Robinhood Chain client 2026-09-28; Cloudflare-gated to non-browser clients",
    "2026-09-28",
  ),
  // No swap venue link has been supplied, so Buy stays inert.
  buyUrl: absent<string>("no buy link announced"),

  // Data source provenance, confirmed live against each provider on
  // 2026-09-28 (see project research notes).
  defiLlamaChainSlug: stated<string>(
    "Robinhood Chain",
    "api.llama.fi/v2/chains — chainId 4663 present",
    "2026-09-28",
  ),
  coingeckoPlatformId: stated<string>(
    "robinhood",
    "api.coingecko.com/api/v3/asset_platforms — chain_identifier 4663",
    "2026-09-28",
  ),
  coingeckoStocksCategory: stated<string>(
    "robinhood-chain-stocks-ecosystem",
    "api.coingecko.com/api/v3/coins/categories/list",
    "2026-09-28",
  ),
  coingeckoMemeCategory: stated<string>(
    "robinhood-chain-meme",
    "api.coingecko.com/api/v3/coins/categories/list",
    "2026-09-28",
  ),
} as const;

export type Register = typeof register;

/** STANDING RULE 2 — derive a display handle from a stored URL. Never store a handle directly. */
export function deriveHandle(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    if (parsed.hostname.includes("github.com")) {
      return segments.length >= 2 ? segments.slice(0, 2).join("/") : last;
    }
    return last ? `@${last}` : parsed.hostname;
  } catch {
    return "";
  }
}

/** Derives the holders page from a stated CA and stated explorer; null otherwise. */
export function holdersHref(ca: Fact<string>, explorer: Fact<string>): string | null {
  if (ca.state !== "stated" || !ca.value || explorer.state !== "stated" || !explorer.value) return null;
  return `${explorer.value}/token/${ca.value}`;
}

/** STANDING RULE 2 — a fact only gets an href when it is actually stated. */
export function hrefFor(fact: Fact<string>): string | null {
  return fact.state === "stated" && fact.value ? fact.value : null;
}
