import type { Fact } from "../register";
import { deriveHandle, hrefFor } from "../register";
import { X_MARK_SVG, GITHUB_MARK_SVG } from "../icons";

export interface SocialIconView {
  name: string;
  href: string | null;
  handle: string | null;
  inert: boolean;
}

/** STANDING RULE 2 — no href unless the record is actually stated. */
export function buildSocialIconView(name: string, fact: Fact<string>): SocialIconView {
  const href = hrefFor(fact);
  return {
    name,
    href,
    handle: href ? deriveHandle(href) : null,
    inert: href === null,
  };
}

function renderIcon(view: SocialIconView, mark: string): string {
  const label = view.inert ? `${view.name} — not yet announced` : `${view.name}: ${view.handle}`;
  if (view.inert) {
    return `<span class="social-icon social-icon--inert" role="img" aria-label="${label}" title="${label}">${mark}</span>`;
  }
  return `<a class="social-icon" href="${view.href}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}">${mark}</a>`;
}

export function renderSocialX(fact: Fact<string>): string {
  return renderIcon(buildSocialIconView("X", fact), X_MARK_SVG);
}

export function renderSocialGithub(fact: Fact<string>): string {
  return renderIcon(buildSocialIconView("GitHub", fact), GITHUB_MARK_SVG);
}
