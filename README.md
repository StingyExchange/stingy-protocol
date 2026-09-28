# Stingy

**Get more from every swap.** Stingy is a route-comparison exchange front end for Robinhood Chain. It compares multiple venues to find an efficient path for a trade, and shows the chain's real numbers while it does.

Website: [stingy.exchange](https://stingy.exchange)

> Status: pre-launch. The site is live with real chain data. Wallet connection and routing ship after the token contract is announced.

## What is in this repo

A static site built with Vite and TypeScript. It reads live data from public sources and renders it. Nothing on the page is invented: anything unknown shows as an em dash.

| Area | Source |
| --- | --- |
| Block, gas, base fee, block age | Robinhood Chain RPC, refreshed every 15 seconds |
| TVL, stablecoins, DEX volume | DefiLlama, refreshed every 10 minutes |
| Stock tokens, trending tokens, ETH and BTC | CoinGecko, refreshed every 60 seconds |

## Chain

| Field | Value |
| --- | --- |
| Network | Robinhood Chain |
| Chain ID | 4663 (`0x1237`) |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |

## Contract address

Not announced yet. The site shows a placeholder until one is confirmed, and its copy button stays disabled.

```
$STINGY  CA: not announced
```

Treat any address shared in chat, replies or DMs as unverified. The only address that counts is the one shown in the contract slot at the top of stingy.exchange.

## Social links

| Channel | Status |
| --- | --- |
| X | Not announced |
| GitHub organisation | Not announced |

Links are added here and on the site at the same time, once accounts exist.

## Run it locally

```bash
npm install
npm run dev
```

Build and check:

```bash
npm run build
npm run gates
```

The build writes a complete deployable site to `dist/`.

## How the project keeps itself honest

- Every external fact (chain ID, RPC, contract, socials) lives in one register with a state of stated, absent or unconfirmed. Absent facts render as inert placeholders, never as guessed links.
- Colours are defined in one tokens file and sampled from the brand artwork.
- Automated checks run against synthetic fixtures, so they pass whether or not a contract address exists yet.

## Documents

- [Whitepaper](docs/whitepaper.md)
- [Tokenomics](docs/tokenomics.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](.github/CONTRIBUTING.md)

## Disclaimer

Experimental software. Trades are final. Nothing here is financial advice. Use at your own risk.

## License

MIT. See [LICENSE](LICENSE).
