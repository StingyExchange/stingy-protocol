import { register } from "../register";
import { renderSocialGithub, renderSocialX } from "./social";

const LOGO_MARK = `<img src="/logo-192.png" width="36" height="36" alt="" decoding="async" />`;

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "#top", label: "Home" },
  { href: "#route", label: "Routing" },
  { href: "#chain", label: "Chain" },
  { href: "#stocks", label: "Stocks" },
  { href: "#trending", label: "Trending" },
  { href: "#about", label: "About" },
];

export function renderHeader(): string {
  const navHtml = NAV_LINKS.map((l) => `<a href="${l.href}" class="nav-link">${l.label}</a>`).join("");

  return `
    <header class="site-header" id="top">
      <a class="brand" href="#top" aria-label="Stingy home">
        <span class="brand-mark">${LOGO_MARK}</span>
        <span class="brand-word">STINGY</span>
      </a>
      <nav class="site-nav" aria-label="Primary">${navHtml}</nav>
      <div class="header-actions">
        <div class="social-row" aria-label="Social links">
          ${renderSocialX(register.socialX)}
          ${renderSocialGithub(register.socialGithub)}
        </div>
        <button type="button" class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          <span class="menu-toggle-bar"></span>
          <span class="menu-toggle-bar"></span>
        </button>
      </div>
      <nav class="mobile-nav" id="mobile-nav" aria-label="Primary, mobile">${navHtml}</nav>
    </header>
  `;
}

export function mountHeader(root: ParentNode): void {
  const toggle = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const header = root.querySelector<HTMLElement>(".site-header");
  if (!toggle || !header) return;

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  root.querySelectorAll<HTMLAnchorElement>(".mobile-nav a").forEach((a) => {
    a.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });

  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      lastY = y;
    },
    { passive: true },
  );
  header.classList.toggle("is-scrolled", lastY > 8);
}
