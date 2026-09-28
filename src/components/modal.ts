import type { MarketToken } from "../sources/coingecko";
import { fetchCoinDetail } from "../sources/coingecko";
import { fmtCompactUsd, fmtNumber, fmtPercent, fmtUsd, UNKNOWN } from "../format";
import { renderSparkline } from "./sparkline";
import { copyText } from "../clipboard";
import { COPY_MARK_SVG } from "../icons";

let lastFocus: HTMLElement | null = null;

function row(label: string, value: string, id?: string): string {
  return `<div class="modal-stat"><span class="stat-label">${label}</span><span class="stat-value" ${id ? `id="${id}"` : ""}>${value}</span></div>`;
}

export function closeTokenModal(): void {
  const el = document.getElementById("token-modal");
  if (!el) return;
  el.remove();
  document.removeEventListener("keydown", onKey);
  lastFocus?.focus();
}

function onKey(e: KeyboardEvent): void {
  if (e.key === "Escape") closeTokenModal();
  if (e.key === "Tab") {
    const modal = document.querySelector<HTMLElement>("#token-modal .modal");
    const focusables = modal ? Array.from(modal.querySelectorAll<HTMLElement>("button, a[href]")) : [];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function openTokenModal(token: MarketToken): void {
  closeTokenModal();
  lastFocus = document.activeElement as HTMLElement | null;
  const host = document.createElement("div");
  host.id = "token-modal";
  host.className = "modal-backdrop";
  host.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button type="button" class="modal-close icon-btn" aria-label="Close">&times;</button>
      <div class="modal-head">
        <img class="token-icon token-icon--lg" src="${token.image}" alt="" width="48" height="48" />
        <div><h3 id="modal-title">${token.symbol}</h3><p class="token-name">${token.name}</p></div>
      </div>
      <div class="modal-price"><span class="token-price token-price--lg">${fmtUsd(token.price)}</span><span class="token-change ${(token.changePct24h ?? 0) >= 0 ? "is-up" : "is-down"}">${fmtPercent(token.changePct24h)}</span></div>
      <div class="modal-spark">${renderSparkline(token.spark, 420, 96, "spark spark--lg")}<p class="data-note">7 day price, CoinGecko</p></div>
      <div class="modal-stats">
        ${row("Market cap", fmtCompactUsd(token.marketCap))}
        ${row("Volume 24 h", fmtCompactUsd(token.volume24h))}
        ${row("High 24 h", UNKNOWN, "md-high")}
        ${row("Low 24 h", UNKNOWN, "md-low")}
        ${row("All-time high", UNKNOWN, "md-ath")}
        ${row("Circulating", UNKNOWN, "md-circ")}
      </div>
      <div class="modal-contract" id="md-contract"><span class="stat-label">Contract on Robinhood Chain</span><span class="modal-contract-val">${UNKNOWN}</span></div>
      <a class="btn btn--ghost modal-link" id="md-link" href="https://www.coingecko.com/en/coins/${encodeURIComponent(token.id)}" target="_blank" rel="noopener noreferrer">View on CoinGecko</a>
    </div>`;
  host.addEventListener("click", (e) => {
    if (e.target === host) closeTokenModal();
  });
  host.querySelector(".modal-close")?.addEventListener("click", closeTokenModal);
  document.body.appendChild(host);
  document.addEventListener("keydown", onKey);
  host.querySelector<HTMLElement>(".modal-close")?.focus();

  void fetchCoinDetail(token.id).then((d) => {
    if (!d || !document.getElementById("token-modal")) return;
    const set = (id: string, v: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };
    set("md-high", fmtUsd(d.high24h));
    set("md-low", fmtUsd(d.low24h));
    set("md-ath", fmtUsd(d.ath));
    set("md-circ", fmtNumber(d.circulating, { notation: "compact", maximumFractionDigits: 2 }));
    const box = document.getElementById("md-contract");
    if (box && d.contract) {
      box.innerHTML = `<span class="stat-label">Contract on Robinhood Chain</span><button type="button" class="modal-contract-val modal-contract-btn" data-copy="${d.contract}" aria-label="Copy contract address">${d.contract}<span class="ca-copy-icon">${COPY_MARK_SVG}</span></button>`;
      box.querySelector("button")?.addEventListener("click", () => void copyText(d.contract as string, "Contract address copied"));
    }
  });
}
