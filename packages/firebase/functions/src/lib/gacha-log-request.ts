import axios from "axios"
import { sleep } from "../utils/sleep.js"
import type { GetWarpHistoryParams } from "../types/get-warp-history-params"
import type { Warp } from "../types/shared/warp"
import { GetWarpHistoryError } from "../types/shared/get-warp-history-error.js"

export class GachaLogRequest {
  static readonly warpTypes = [11, 12, 1]

  private processedCount = 0

  constructor(
    private readonly params: GetWarpHistoryParams,
    private readonly onProgress: (updateProgress: { [key: string]: number }) => void,
  ) {
  }

  async getGachaLogForAllWarpTypes(): Promise<Warp[]> {
    const result: Warp[] = []
    let count = 0

    for (const warpType of GachaLogRequest.warpTypes) {
      count++

      this.onProgress({
        "progress.gachaTypeCount": count,
      })
      result.push(...await this.getGachaLogForWarpType(warpType.toString()))
    }

    return result
  }

  async getGachaLogForWarpType(warpType: string): Promise<Warp[]> {
    const lastId = this.params.lastIds[warpType]
    const result: Warp[] = []
    let endLoop = false
    let lastIdTemp: string | null = null

    let has5Star = false
    let has4Star = false

    while (!endLoop) {
      const list: Warp[] = await this.sendGachaLogRequest(warpType, lastIdTemp)

      if (list.length === 0) {
        break
      }

      for (const item of list) {
        if (this.params.untilLatestRare && has4Star && has5Star) {
          endLoop = true
          break
        }

        if (lastId && item.id === lastId) {
          endLoop = true
          break
        }
        result.push(item)
        if (item.rankType === "5") {
          has5Star = true
        }
        if (item.rankType === "4") {
          has4Star = true
        }

        this.processedCount++
      }

      lastIdTemp = list.splice(-1)[0].id

      this.onProgress({
        "progress.gachaCount": this.processedCount,
      })

      await sleep(1000)
    }

    return result.reverse()
  }

  private async sendGachaLogRequest(warpType: string, lastId: string | null): Promise<Warp[]> {
    const endpoint = "https://api-os-takumi.mihoyo.com/common/gacha_record/api/getGachaLog"
    const params = {
      authkey_ver: "1",
      sign_type: "2",
      auth_appid: "webview_gacha",
      lang: "ja",
      game_biz: "hkrpg_global",
      size: "20",
      authkey: this.params.authKey,
      region: this.params.region,
      gacha_type: warpType,
      end_id: lastId ?? "0",
    }

    const url = new URL(`${endpoint}?${new URLSearchParams(params).toString()}`)

    const result = await axios.get<{
      retcode: number
      message: string
      data: {
        list: {
          id: string
          name: string
          rank_type: string
          item_type: "キャラクター" | "光円錐"
          time: string
        }[]
      }
    }>(url.toString())

    if (result.data.retcode !== 0) {
      switch (result.data.retcode) {
        case -101:
          // 認証キータイムアウト
          throw new GetWarpHistoryError(
            "authKeyExpired",
            "Authentication key has expired",
          )

        case -100:
          // 認証キー不正
          throw new GetWarpHistoryError(
            "authKeyInvalid",
            "Authentication key is invalid",
          )

        case -110:
          // 頻繁なリクエスト
          throw new GetWarpHistoryError(
            "tooManyRequests",
            "Too many requests",
          )

        default:
          // 不明

          // miHoYo APIのレスポンスをログ出力
          console.error("Error: miHoYo API returned non-zero retcode")
          console.error(result.data)

          throw new GetWarpHistoryError(
            "internal",
            "Unknown error",
          )
      }
    }

    return result.data.data.list.map<Warp>(e => ({
      id: e.id,
      name: e.name,
      rankType: e.rank_type,
      itemType: e.item_type,
      gachaType: warpType,
      time: e.time,
    }))
  }
}
