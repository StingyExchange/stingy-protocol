import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts"],
    testTimeout: 5000,
    hookTimeout: 5000,
    teardownTimeout: 5000,
    reporters: "default",
  },
});
