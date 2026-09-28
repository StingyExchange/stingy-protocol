import { describe, expect, it } from "vitest";
import { register, deriveHandle, hrefFor, holdersHref } from "../src/register";

const ABSENT = { state: "absent" as const, value: null, source: "fixture", asOf: null };
const CA_STATED = { state: "stated" as const, value: "0x4da3916d3ae6feece32ec8a2c4856d4abeb41bfd", source: "fixture", asOf: "2026-01-01" };
const EXPLORER = { state: "stated" as const, value: "https://explorer.example", source: "fixture", asOf: "2026-01-01" };

describe("register: external facts", () => {
  it("absent fixtures give no href and no holders link; stated fixtures give both", () => {
    expect(hrefFor(ABSENT)).toBeNull();
    expect(hrefFor({ ...CA_STATED, state: "unconfirmed" as const })).toBeNull();
    expect(hrefFor({ ...CA_STATED, value: "https://x.com/example" })).toBe("https://x.com/example");
    expect(holdersHref(ABSENT, EXPLORER)).toBeNull();
    expect(holdersHref(CA_STATED, EXPLORER)).toBe(`https://explorer.example/token/${CA_STATED.value}`);
    expect(holdersHref(CA_STATED, ABSENT)).toBeNull();
  });

  it("live register is internally consistent whether a value is absent or stated", () => {
    for (const fact of Object.values(register) as Array<{ state: string; value: unknown }>) {
      expect(["stated", "absent", "unconfirmed"]).toContain(fact.state);
      if (fact.state === "stated") expect(fact.value).not.toBeNull();
      else expect(fact.value).toBeNull();
    }
  });

  it("carries the stated chain facts with sources", () => {
    expect(register.chainName.state).toBe("stated");
    expect(register.chainIdDec.value).toBe(4663);
    expect(register.chainIdHex.value).toBe("0x1237");
    expect(register.rpcUrl.source.length).toBeGreaterThan(0);
  });

  it("derives display handles from stored URLs (X and GitHub)", () => {
    expect(deriveHandle("https://x.com/stingyexchange")).toBe("@stingyexchange");
    expect(deriveHandle("https://github.com/stingy/stingy")).toBe("stingy/stingy");
  });

});
