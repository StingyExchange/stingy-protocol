import { register } from "../register";
import { renderCaBlock } from "./caSlot";
import { renderRouteGraph } from "./routeGraph";

// Rotating lines are the client's own slide copy (reference/STINGY 1-6).
const ROTATING: string[] = [
  "Stingy compares multiple venues to find an efficient route for every swap.",
  "Compare liquidity across venues and discover efficient routes before you swap.",
  "Stingy analyzes available paths across venues to help identify an efficient route for your trade.",
  "Compare venues, follow the route, and see where your trade is being executed.",
  "Stingy brings multiple trading paths together to help you explore efficient swap execution.",
  "Every swap gets a route comparison across available venues, helping you discover a more efficient path.",
];

export function rotatingLines(): readonly string[] {
  return ROTATING;
}

export function renderCoinField(): string {
  const coin = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" class="coin-rim"/><circle cx="24" cy="24" r="15" class="coin-face"/><path d="M17 20c2-4 12-4 14 0M17 28c2 4 12 4 14 0" class="coin-mark"/></svg>`;
  return `
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>
    <div class="coin-field" aria-hidden="true">
      ${Array.from({ length: 9 }, (_, i) => `<span class="coin coin-${i}" style="--i:${i}">${coin}</span>`).join("")}
    </div>`;
}

export function renderHero(): string {
  return `
    <section class="hero">
      <div class="hero-copy reveal">
        <p class="eyebrow">${register.chainName.value ?? "—"} · Chain ID ${register.chainIdDec.state === "stated" ? register.chainIdDec.value : "—"}</p>
        <h1 class="hero-title">
          <span class="hero-title-line">Get more from</span>
          <span class="hero-title-line">every <em>swap.</em></span>
        </h1>
        <div class="hero-rotor" aria-live="off">
          ${ROTATING.map((t, i) => `<p class="hero-rotor-line ${i === 0 ? "is-active" : ""}">${t}</p>`).join("")}
        </div>
        ${renderCaBlock()}
        <div class="hero-cta-row">
          <a href="#stocks" class="btn btn--primary"><span>Trade stocks</span><span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
          <a href="#route" class="btn btn--ghost">See how routing works</a>
        </div>
      </div>
      <div class="hero-visual reveal" aria-hidden="true">
        <span class="hero-halo"></span>
        <img class="hero-logo" src="/logo.png" width="512" height="512" alt="" decoding="async" fetchpriority="high" />
      </div>
    </section>
    <section class="panel route-panel" id="route">
      <div class="section-head reveal">
        <div>
          <p class="eyebrow">How it routes</p>
          <h2>Every route. One smart choice.</h2>
          <p class="section-sub">Venues named below come from Stingy’s own artwork. The diagram is an illustration, not a live quote.</p>
        </div>
      </div>
      ${renderRouteGraph()}
    </section>`;
}

export function mountHero(root: ParentNode): void {
  const lines = Array.from(root.querySelectorAll<HTMLElement>(".hero-rotor-line"));
  if (lines.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i = 0;
  window.setInterval(() => {
    lines[i].classList.remove("is-active");
    i = (i + 1) % lines.length;
    lines[i].classList.add("is-active");
  }, 5200);
}
