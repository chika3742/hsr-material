import {defineStore} from "pinia"
import {ThemeSetting} from "~/types/strings"

export const useConfigStore = defineStore("config", {
  state: () => ({
    theme: "auto" as ThemeSetting,
  }),
  actions: {
    getCurrentTheme() {
      if (this.theme === "auto") {
        if (process.client) {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        }
        return "light"
      }
      return this.theme
    },
  },
  persist: true,
})
