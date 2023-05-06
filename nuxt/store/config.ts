import {defineStore} from "pinia"
import {DateTime} from "luxon"
import {ThemeSetting} from "~/types/strings"

export const useConfigStore = defineStore("config", {
  state: () => ({
    theme: "auto" as ThemeSetting,
    warpsUrl: "",
    tpCount: 0,
    tpBaseTime: DateTime.now().toISOTime()!,
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
