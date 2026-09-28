import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const tokensCss = readFileSync(resolve(__dirname, "../src/tokens.css"), "utf8");
const mainCss = readFileSync(resolve(__dirname, "../src/main.css"), "utf8");
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("palette: sampled from real assets, literals live in one file", () => {
  it("every declared hex in tokens.css is a snapped pixel with a source coordinate", () => {
    const comment = tokensCss.slice(0, tokensCss.indexOf("*/"));
    const snapped = new Set([...comment.matchAll(/(#[0-9a-f]{6}) @ \d+,\d+/g)].map((m) => m[1]));
    const declared = [...tokensCss.slice(tokensCss.indexOf("*/")).matchAll(/--[a-z-]+:\s*(#[0-9a-f]{6})/g)].map((m) => m[1]);
    expect(snapped.size).toBeGreaterThanOrEqual(10);
    expect(declared.length).toBe(snapped.size);
    for (const hex of declared) expect(snapped.has(hex)).toBe(true);
  });

  it("provenance states the method and the premultiplied-resize finding", () => {
    expect(tokensCss).toMatch(/k-means/);
    expect(tokensCss).toMatch(/SNAPPED/);
    expect(tokensCss).toMatch(/premultiplied/);
  });

  it("no color literals anywhere except tokens.css", () => {
    expect(mainCss.match(HEX)).toBeNull();
    expect(mainCss.match(/\b(oklch|hsl|rgba?)\(/)).toBeNull();
    for (const file of walk(resolve(__dirname, "../src")).filter((f) => /\.(ts|css)$/.test(f) && !f.endsWith("tokens.css"))) {
      expect(readFileSync(file, "utf8").match(HEX), file).toBeNull();
    }
  });
});
