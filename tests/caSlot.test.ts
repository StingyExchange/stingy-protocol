import { describe, expect, it } from "vitest";
import type { Fact } from "../src/register";
import { buildCaSlotView, renderCaSlot, renderCaActions } from "../src/components/caSlot";

// GATES RULE: synthetic fixtures only — never the live register — and the
// suite must pass whether the fixture is absent or stated.
const ABSENT_FIXTURE: Fact<string> = { state: "absent", value: null, source: "fixture", asOf: null };
const STATED_FIXTURE: Fact<string> = {
  state: "stated",
  value: "0x4da3916d3ae6feece32ec8a2c4856d4abeb41bfd",
  source: "fixture",
  asOf: "2026-01-01",
};
const STATED_EXPLORER: Fact<string> = { state: "stated", value: "https://explorer.example", source: "fixture", asOf: "2026-01-01" };
const UNCONFIRMED_FIXTURE: Fact<string> = { state: "unconfirmed", value: null, source: "fixture", asOf: null };

describe("CA slot: gate exits 0 for both absent and stated", () => {
  it("absent fixture: inert view, disabled copy button, no date", () => {
    const view = buildCaSlotView(ABSENT_FIXTURE);
    expect(view.copyEnabled).toBe(false);
    expect(view.full).toBeNull();
    const html = renderCaSlot(ABSENT_FIXTURE);
    expect(html).toContain("disabled");
    expect(html).toContain("not yet announced");
    const actions = renderCaActions(ABSENT_FIXTURE, ABSENT_FIXTURE, STATED_EXPLORER);
    expect(actions).toContain("ca-action--inert");
    expect(actions).not.toContain("<a ");
  });

  it("stated fixture: full address exposed, copy enabled, one span per char", () => {
    const view = buildCaSlotView(STATED_FIXTURE);
    expect(view.copyEnabled).toBe(true);
    expect(view.full).toBe(STATED_FIXTURE.value);
    const html = renderCaSlot(STATED_FIXTURE);
    const spanCount = (html.match(/class="ca-char"/g) ?? []).length;
    expect(spanCount).toBe(STATED_FIXTURE.value!.length);
    expect(html).not.toContain("disabled");
    expect(renderCaActions(STATED_FIXTURE, ABSENT_FIXTURE, STATED_EXPLORER)).toContain(`href="https://explorer.example/token/${STATED_FIXTURE.value}"`);
  });

  it("unconfirmed fixture: copy stays disabled", () => {
    const view = buildCaSlotView(UNCONFIRMED_FIXTURE);
    expect(view.copyEnabled).toBe(false);
    expect(view.stateLabel).toBe("unconfirmed");
  });
});
