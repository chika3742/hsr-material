import {defineStore} from "pinia"
import {Warp} from "#shared/warp"

export const useWarpsStore = defineStore("warps", {
  state: () => ({
    warps: [] as Warp[],
    untilLatestRare: true,
  }),
  getters: {
    lastIds(): Record<string, string> {
      const result = {} as Record<string, string>
      for (const warp of [...this.warps].reverse()) {
        if (!result[warp.gachaType]) {
          result[warp.gachaType] = warp.id
        }
      }
      return result
    },
  },
  persist: true,
})
