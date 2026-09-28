import { register } from "../register";

const W = 640;
const H = 340;
const HUB = { x: 392, y: 170 };
const DOTS_PER_ROUTE = 12;

function bezier(p0: number[], p1: number[], p2: number[], p3: number[], t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  return [x, y];
}

export interface RouteGeometry {
  venue: string;
  y: number;
  d: string;
  dots: Array<[number, number]>;
}

/** Pure geometry for the illustrative route graph: one curve per venue converging on the hub. */
export function buildRouteGeometry(venues: readonly string[]): RouteGeometry[] {
  const gap = (H - 60) / Math.max(1, venues.length - 1 || 1);
  return venues.map((venue, i) => {
    const y = venues.length === 1 ? H / 2 : 30 + i * gap;
    const p0 = [176, y];
    const p1 = [290, y];
    const p2 = [300, HUB.y];
    const p3 = [HUB.x, HUB.y];
    const dots: Array<[number, number]> = [];
    for (let k = 0; k < DOTS_PER_ROUTE; k++) dots.push(bezier(p0, p1, p2, p3, k / (DOTS_PER_ROUTE - 1)));
    return { venue, y, d: `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`, dots };
  });
}

const STEPS: Array<{ title: string; body: string }> = [
  { title: "Every venue asked", body: "Each route on Robinhood Chain is priced side by side, ranked after fees and gas." },
  { title: "Split when it pays", body: "An order is spread across venues only when that beats sending it through one." },
  { title: "Simulated first", body: "A swap is checked before a wallet ever has to open. Nothing is sent blind." },
];

export function renderRouteGraph(): string {
  const venues = register.routeVenues.state === "stated" && register.routeVenues.value ? register.routeVenues.value : [];
  const geo = buildRouteGeometry(venues);
  const routes = geo
    .map(
      (r, i) => `
      <g class="rg-route" data-i="${i}">
        <path class="rg-line" d="${r.d}" fill="none" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round"/>
        ${r.dots.map(([x, y], k) => `<circle class="rg-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" style="--k:${k};--r:${i}"/>`).join("")}
        <g class="rg-venue"><rect x="8" y="${r.y - 20}" width="168" height="40" rx="12"/><text x="92" y="${r.y + 5}" text-anchor="middle">${r.venue}</text></g>
      </g>`,
    )
    .join("");

  return `
    <div class="route-card reveal" data-step="0">
      <p class="route-flag">Illustration · no live quote</p>
      <svg class="route-graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustration: swap routes from ${venues.join(", ")} converging on one execution">
        ${routes}
        <circle class="rg-hub-ring" cx="${HUB.x}" cy="${HUB.y}" r="16"/>
        <circle class="rg-hub" cx="${HUB.x}" cy="${HUB.y}" r="8"/>
        <line class="rg-out" x1="${HUB.x + 8}" y1="${HUB.y}" x2="470" y2="${HUB.y}" stroke-width="1.6" stroke-dasharray="1 7" stroke-linecap="round"/>
        <g class="rg-target"><rect x="470" y="${HUB.y - 34}" width="160" height="68" rx="18"/><image href="/logo-192.png" x="480" y="${HUB.y - 28}" width="56" height="56"/><text x="546" y="${HUB.y + 5}">$STINGY</text></g>
        <g class="rg-check"><circle cx="612" cy="${HUB.y - 34}" r="11"/><path d="M606 ${HUB.y - 34} l4 4 8 -9" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
      </svg>
      <ol class="route-steps">
        ${STEPS.map(
          (s, i) => `
          <li><button type="button" class="route-step ${i === 0 ? "is-active" : ""}" data-step="${i}" aria-pressed="${i === 0}">
            <span class="route-step-title">${s.title}</span>
            <span class="route-step-body">${s.body}</span>
            <span class="route-step-bar" aria-hidden="true"></span>
          </button></li>`,
        ).join("")}
      </ol>
    </div>`;
}

export function mountRouteGraph(root: ParentNode): void {
  const card = root.querySelector<HTMLElement>(".route-card");
  if (!card) return;
  const buttons = Array.from(card.querySelectorAll<HTMLButtonElement>(".route-step"));
  const select = (i: number) => {
    card.dataset.step = String(i);
    buttons.forEach((b, j) => {
      b.classList.toggle("is-active", i === j);
      b.setAttribute("aria-pressed", String(i === j));
    });
  };
  buttons.forEach((b, i) => b.addEventListener("click", () => select(i)));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    let i = 0;
    let paused = false;
    card.addEventListener("pointerenter", () => (paused = true));
    card.addEventListener("pointerleave", () => (paused = false));
    card.addEventListener("focusin", () => (paused = true));
    card.addEventListener("focusout", () => (paused = false));
    window.setInterval(() => {
      if (paused) return;
      i = (i + 1) % buttons.length;
      select(i);
    }, 4800);
  }
}
