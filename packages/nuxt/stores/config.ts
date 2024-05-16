import {DateTime} from "luxon"

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
    tpBaseTime: DateTime.now().toISO(),
    /**
     * Whether to show the pity history in Warps Pity Counter.
     */
    warpsShowPityList: false,
    /**
     * Uid for sync game data.
     */
    uid: "",
    /**
     * Character skill levels stored in the app.
     */
    characterLevels: {} as {[characterId: string]: {[skill: string]: number}},
    /**
     * Owned characters.
     */
    ownedCharacters: [] as string[],
    characterOrder: [] as string[],
    equilibriumLevel: 6,
    showFarmingCount: true,
    previousVersion: getCurrentVersionText(),
  }),
  actions: {
    /**
     * Gets the actual theme to set. (To avoid caching the result, this method is an action.)
     *
     * If the theme is set to `auto`, it will return `dark` or `light` depending on the user's OS settings.
     * Otherwise, it will return the theme set in app.
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
