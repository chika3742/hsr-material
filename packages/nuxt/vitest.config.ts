import { resolve } from "path"
import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["test/**/*.test.ts"],
    exclude: ["node_modules", ".nuxt"],
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
      "#shared": resolve(__dirname, "../../firebase/functions/src/types/shared"),
    },
    extensions: [".ts", ".js", ".json", ".yaml", ".vue"],
  },
})
