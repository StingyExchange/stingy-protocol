# Stingy Whitepaper

## Summary

Stingy is a swap front end that asks every available venue for a price before a trade happens, then helps the trader pick an efficient route. It is built for Robinhood Chain and is currently pre-launch.

The name is the product philosophy. Stingy people read the price tag twice.

## The problem

On a young chain, liquidity is scattered. The same pair can trade on several venues at once, each with different depth, fees and gas cost. A trader who opens one venue sees one answer and rarely knows whether it was the best one. Comparing by hand is slow, and the answer changes by the time the comparison is done.

## The approach

Stingy is built around three habits.

1. **Ask every venue.** A trade is priced across the venues on Robinhood Chain side by side, ranked after fees and gas rather than by headline rate.
2. **Split only when it pays.** An order is spread across several venues only when that beats sending it through one. Splitting has a cost, so it must earn its place.
3. **Simulate first.** A route is checked against current chain state before a wallet is asked to sign. Nothing is sent blind.

The venues named in Stingy's own artwork are Uniswap v4, KyberSwap, Nordstern and 0x. Support for any venue depends on integration work described in the roadmap and is not live today.

## Principles

- **Non-custodial.** Trades are signed from the trader's own wallet. Stingy does not hold funds in between.
- **Exact-amount approvals.** An approval covers the amount being swapped, not an open-ended allowance.
- **Say what is known.** Unknown values are shown as unknown. Prices, volumes and chain figures come from named public sources, and the site says which.
- **Cautious language.** Stingy helps find an efficient route. It does not promise the best possible price, because prices move and no comparison can guarantee one.

## What exists today

The public site reads live data from the chain RPC, DefiLlama and CoinGecko and presents it: chain status, tokenized stocks, trending tokens and a description of how routing will work. The routing diagram on the site is an illustration, not a live quote.

## What does not exist yet

- Wallet connection and swap execution
- Live route quotes
- A published token contract address
- Any announced fee schedule

These are listed so nobody assumes otherwise.

## Token

A token, $STINGY, is planned. Its contract address has not been announced. See [tokenomics](tokenomics.md) for what is and is not decided.

## Risks

- Smart contract risk in any venue a route touches
- Liquidity changes between quote and execution
- Chain or RPC outages
- Data providers being delayed, wrong or unavailable
- Early software that may contain bugs

## Vision

A trader on Robinhood Chain should be able to open one page, see every reasonable path for a swap, understand why one was chosen, and keep the difference. The long-term goal is a small, transparent tool that earns trust by being precise about what it knows.
