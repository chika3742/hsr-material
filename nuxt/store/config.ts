import {defineStore} from "pinia"
import {DateTime} from "luxon"
import {ThemeSetting} from "~/types/strings"

export const useConfigStore = defineStore("config", {
  state: () => ({
    /**
     * Theme setting.
     */
    theme: "auto" as ThemeSetting,
    /**
     * URL with authkey for Warps Pity Counter.
     */
    warpsUrl: "",
    /**
     * Number of Trailblaze Point set by user.
     */
    tpCount: 0,
    /**
     * Time the user set the Trailblaze Point count.
     */
    tpBaseTime: DateTime.now().toISO()!,
    /**
     * Whether to show the pity history in Warps Pity Counter.
     */
    warpsShowPityList: false,
  }),
  actions: {
    /**
     * Gets the actual theme to set. (This method is in `actions` to avoid caching the result.)
     *
     * If the theme is set to "auto", it will return "dark" or "light" depending on the user's OS.
     * otherwise, it will return the theme set by the user.
     */
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
