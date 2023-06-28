import {Table} from "dexie"
import {Warp} from "#shared/warp"
import {_db} from "~/dexie/db"

/**
 * Provides methods for warp-related database operations.
 */
export class WarpsProvider {
  warps: Table<Warp>

  constructor() {
    this.warps = _db.warps
  }

  add(...warp: Warp[]) {
    return this.warps.bulkAdd(warp)
  }

  async getLastIds(warpTypes: string[]) {
    const result = {} as Record<string, string>
    for (const warpType of warpTypes) {
      const warp = await this.warps.where("gachaType").equals(warpType).last()
      if (warp) {
        result[warp.gachaType] = warp.id
      }
    }

    return result
  }

  clear() {
    return this.warps.clear()
  }
}
