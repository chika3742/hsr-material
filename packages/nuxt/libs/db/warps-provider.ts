import type {Table} from "dexie"
import type {Warp} from "#shared/warp"
import {_db} from "~/dexie/db"
import {DbProvider} from "~/libs/db/db-provider"

/**
 * Provides methods for warp-related database operations.
 */
export class WarpsProvider extends DbProvider {
  warps: Table<Warp>

  constructor() {
    super()
    this.warps = _db.warps
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

  add(...warp: Warp[]) {
    return this.transactionWithFirestore([this.warps], () => {
      return this.warps.bulkAdd(warp)
    })
  }

  clear() {
    return this.transactionWithFirestore([this.warps], () => {
      return this.warps.clear()
    })
  }
}
