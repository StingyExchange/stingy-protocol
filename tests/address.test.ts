import { describe, expect, it } from "vitest";
import { isWellFormedAddress } from "../src/address";

// STANDING RULE 3: never blanket-reject 0x hex. Casing must never be the
// reason a well-formed address is rejected.
describe("address: gate warning — never blanket-reject 0x hex", () => {
  it("accepts lowercase, mixed-case, and uppercase addresses alike", () => {
    expect(isWellFormedAddress("0x4da3916d3ae6feece32ec8a2c4856d4abeb41bfd")).toBe(true);
    expect(isWellFormedAddress("0x4Da3916D3ae6FEece32Ec8a2C4856D4abeB41Bfd")).toBe(true);
    expect(isWellFormedAddress("0x4DA3916D3AE6FEECE32EC8A2C4856D4ABEB41BFD")).toBe(true);
  });

  it("rejects malformed shape — too short or missing the 0x prefix", () => {
    expect(isWellFormedAddress("0x1234")).toBe(false);
    expect(isWellFormedAddress("4da3916d3ae6feece32ec8a2c4856d4abeb41bfd")).toBe(false);
  });

  it("rejects null/undefined/empty without throwing", () => {
    expect(isWellFormedAddress(null)).toBe(false);
    expect(isWellFormedAddress(undefined)).toBe(false);
    expect(isWellFormedAddress("")).toBe(false);
  });
});
