import { register } from "../register";
import type { Fact } from "../register";

const ASSURANCES: Array<{ title: string; body: string }> = [
  { title: "Non-custodial", body: "A swap is signed from your own wallet. Stingy never holds funds in between." },
  { title: "Exact-amount approvals", body: "An approval is scoped to the amount being swapped, not an open-ended allowance." },
  { title: "Simulated before you sign", body: "A route is checked against current state before a wallet is ever asked to sign." },
];

const FAQ: Array<{ q: string; a: string }> = [
  { q: "Is Stingy live?", a: "Not yet. This site shows real Robinhood Chain data. Wallet connection and routing launch once the token contract is announced." },
  { q: "What are the fees?", a: "No fee schedule has been announced. Nothing on this page states one, so nothing is invented here." },
  { q: "Where do the numbers come from?", a: "Block data comes straight from the chain RPC. TVL, stablecoins and DEX volume come from DefiLlama. Token prices come from CoinGecko. Anything unknown shows as an em dash." },
  { q: "Which contract address is real?", a: "None has been announced. Treat any address shared in chat or replies as unverified until it appears in the contract slot at the top of this page." },
];

const LABELS: Array<[string, keyof typeof register]> = [
  ["Contract address", "contractAddress"],
  ["X account", "socialX"],
  ["GitHub account", "socialGithub"],
  ["Buy link", "buyUrl"],
  ["Chain", "chainName"],
  ["RPC endpoint", "rpcUrl"],
  ["Explorer", "explorerBase"],
];

export function renderRegisterTable(): string {
  const rows = LABELS.map(([label, key]) => {
    const fact = register[key] as Fact<unknown>;
    return `<tr><th scope="row">${label}</th><td><span class="state state--${fact.state}">${fact.state}</span></td><td class="reg-source">${fact.source}</td></tr>`;
  }).join("");
  return `<table class="reg-table"><thead><tr><th>Record</th><th>State</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderAbout(): string {
  return `
    <section class="about" id="about">
      <div class="section-head reveal">
        <div>
          <p class="eyebrow">Fees and questions</p>
          <h2>Built stingy on purpose</h2>
          <p class="section-sub">Stingy is a fresh build on Robinhood Chain, launching wallet connection and routing once the token contract is live.</p>
        </div>
      </div>
      <ul class="assurance-grid">
        ${ASSURANCES.map((a, i) => `<li class="assurance-item reveal" style="--stagger:${i}"><h3>${a.title}</h3><p>${a.body}</p></li>`).join("")}
      </ul>
      <div class="faq reveal">
        ${FAQ.map((f) => `<details class="faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}
      </div>
      <div class="reveal">
        <h3 class="reg-title">What is confirmed, and what is not</h3>
        ${renderRegisterTable()}
      </div>
      <p class="disclosure reveal">Experimental software, pre-launch. Verify any address independently. Use at your own risk.</p>
    </section>`;
}
