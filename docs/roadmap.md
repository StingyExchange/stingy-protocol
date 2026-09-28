# Roadmap

Phases are ordered by dependency, not by date. No dates are promised. A phase is marked done only when it can be seen working.

## Phase 1: Public site (done)

- Live chain status from the Robinhood Chain RPC: block, gas, base fee, block age
- Chain TVL, stablecoins and DEX volume from DefiLlama
- Tokenized stocks and trending tokens from CoinGecko, with price history charts
- Contract address slot that stays inert until an address is announced
- Register of every external fact, marked stated, absent or unconfirmed
- Brand palette sampled from the real logo and artwork
- Automated checks that run on synthetic data

## Phase 2: Announcements

- Confirm and publish the token contract address
- Open official X and GitHub accounts, then link them from the site and README
- Publish final tokenomics
- Publish a fee schedule, or state clearly that there is none

## Phase 3: Route engine

- Integrate price sources for the venues named in Stingy's artwork
- Rank routes after fees and gas
- Simulate each route against current chain state
- Show the reasoning for a chosen route, not just the result
- Test against real liquidity before anything is exposed to users

## Phase 4: Wallet and swaps

- Wallet connection
- Exact-amount approvals
- Swap execution from the trader's own wallet
- Clear failure messages when a quote goes stale

## Phase 5: Trader tools

- Trade history for a connected wallet
- Portfolio view
- Share cards for completed swaps
- Limit orders, if the underlying venues support them

## Phase 6: Hardening

- Independent review of any contract or integration Stingy relies on
- Public bug reporting process
- Monitoring for data source outages, with graceful fallbacks

## How this roadmap changes

Items move, split or get dropped as the chain and its venues change. When that happens this file is edited in the open, and removed items are noted rather than deleted quietly.
