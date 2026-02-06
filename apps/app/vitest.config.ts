import path from "node:path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// biome-ignore lint/style/noDefaultExport: vitest config requires default export
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "../../contracts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
