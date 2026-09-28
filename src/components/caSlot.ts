import { register, holdersHref } from "../register";
import type { Fact } from "../register";
import { COPY_MARK_SVG, CHECK_MARK_SVG } from "../icons";
import { copyText } from "../clipboard";

export interface CaSlotView {
  display: string;
  full: string | null;
  copyEnabled: boolean;
  stateLabel: string;
}

/** Pure, testable view model for the CA slot. */
export function buildCaSlotView(fact: Fact<string>): CaSlotView {
  if (fact.state === "stated" && fact.value) {
    return { display: fact.value, full: fact.value, copyEnabled: true, stateLabel: "live" };
  }
  if (fact.state === "unconfirmed") {
    return { display: "Contract address unconfirmed", full: null, copyEnabled: false, stateLabel: "unconfirmed" };
  }
  return { display: "Contract address not yet announced", full: null, copyEnabled: false, stateLabel: "absent" };
}

export function renderCaSlot(fact: Fact<string>): string {
  const view = buildCaSlotView(fact);
  const chars = view.full
    ? view.full
        .split("")
        .map((c, i) => `<span class="ca-char" style="--i:${i}">${c}</span>`)
        .join("")
    : `<span class="ca-placeholder">${view.display}</span>`;

  return `
    <div class="ca-slot" data-state="${view.stateLabel}">
      <span class="ca-label">CA</span>
      <code class="ca-value" title="${view.full ?? ""}" aria-label="${view.full ? `Contract address ${view.full}` : view.display}">${chars}</code>
      <button
        type="button"
        class="ca-copy"
        data-full="${view.full ?? ""}"
        ${view.copyEnabled ? "" : 'disabled aria-disabled="true"'}
        title="${view.copyEnabled ? "Copy contract address" : "No contract address to copy yet"}"
        aria-label="${view.copyEnabled ? "Copy contract address" : "No contract address to copy yet"}"
      >
        <span class="ca-copy-icon">${COPY_MARK_SVG}</span>
        <span class="ca-copy-icon ca-copy-icon--done">${CHECK_MARK_SVG}</span>
      </button>
    </div>
  `;
}

export interface CaActionsView {
  buyHref: string | null;
  holdersHref: string | null;
}

export function buildCaActionsView(ca: Fact<string>, buy: Fact<string>, explorer: Fact<string>): CaActionsView {
  return {
    buyHref: buy.state === "stated" && buy.value ? buy.value : null,
    holdersHref: holdersHref(ca, explorer),
  };
}

function action(label: string, href: string | null, primary: boolean): string {
  const cls = `ca-action ${primary ? "ca-action--primary" : ""}`;
  return href
    ? `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    : `<span class="${cls} ca-action--inert" role="link" aria-disabled="true" title="Available once the contract address and link are announced">${label}</span>`;
}

export function renderCaActions(ca: Fact<string>, buy: Fact<string>, explorer: Fact<string>): string {
  const view = buildCaActionsView(ca, buy, explorer);
  return `${action("Buy", view.buyHref, true)}${action("Holders", view.holdersHref, false)}`;
}

export function renderCaBlock(): string {
  return `
    <div class="hero-ca-wrap">
      <span class="hero-ca-tag">$STINGY</span>
      ${renderCaSlot(register.contractAddress)}
      <div class="ca-actions">${renderCaActions(register.contractAddress, register.buyUrl, register.explorerBase)}</div>
    </div>`;
}

export function mountCaSlot(root: ParentNode): void {
  const button = root.querySelector<HTMLButtonElement>(".ca-copy");
  if (!button || button.disabled) return;
  const full = button.dataset.full;
  if (!full) return;
  button.addEventListener("click", async () => {
    await copyText(full, "Contract address copied");
    button.classList.add("ca-copy--done");
    button.setAttribute("aria-label", "Copied");
    window.setTimeout(() => {
      button.classList.remove("ca-copy--done");
      button.setAttribute("aria-label", "Copy contract address");
    }, 1600);
  });
}
