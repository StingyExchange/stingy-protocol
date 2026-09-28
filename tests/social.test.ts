import { describe, expect, it } from "vitest";
import type { Fact } from "../src/register";
import { buildSocialIconView, renderSocialX } from "../src/components/social";

const ABSENT_FIXTURE: Fact<string> = { state: "absent", value: null, source: "fixture", asOf: null };
const STATED_FIXTURE: Fact<string> = {
  state: "stated",
  value: "https://x.com/stingyexchange",
  source: "fixture",
  asOf: "2026-01-01",
};

describe("social icons: inert when absent, linked when stated", () => {
  it("absent fixture: inert, no href, no handle, no dead anchor in markup", () => {
    const view = buildSocialIconView("X", ABSENT_FIXTURE);
    expect(view.inert).toBe(true);
    expect(view.href).toBeNull();
    const html = renderSocialX(ABSENT_FIXTURE);
    expect(html).toContain("social-icon--inert");
    expect(html).not.toContain("<a ");
  });

  it("stated fixture: linked with a derived handle and the exact stored URL", () => {
    const view = buildSocialIconView("X", STATED_FIXTURE);
    expect(view.inert).toBe(false);
    expect(view.handle).toBe("@stingyexchange");
    const html = renderSocialX(STATED_FIXTURE);
    expect(html).toContain(`href="${STATED_FIXTURE.value}"`);
  });
});
