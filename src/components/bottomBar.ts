import { fmtGwei, fmtNumber, UNKNOWN } from "../format";
import type { ChainSnapshot } from "../sources/chain";

export function renderBottomBar(): string {
  return `
    <div class="bottom-bar">
      <span class="bb-chip"><span class="bb-dot" aria-hidden="true"></span>Block <b id="bb-block">${UNKNOWN}</b></span>
      <span class="bb-chip bb-hide-sm">Gas <b id="bb-gas">${UNKNOWN}</b></span>
      <span class="bb-msg">Experimental, use at your own risk</span>
      <span class="bb-chip bb-hide-sm">Powered by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a></span>
      <a class="bb-chip" href="#about">About</a>
    </div>`;
}

export function updateBottomBar(snapshot: ChainSnapshot | null): void {
  if (!snapshot) return;
  const block = document.getElementById("bb-block");
  const gas = document.getElementById("bb-gas");
  if (block) block.textContent = `#${fmtNumber(snapshot.blockNumber)}`;
  if (gas) gas.textContent = fmtGwei(snapshot.gasPriceWei);
}
