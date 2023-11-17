import type {Functions} from "@firebase/functions"
import {httpsCallable} from "@firebase/functions"
import type {DispatchGetWarpHistoryParams, DispatchGetWarpHistoryResult} from "#shared/dispatch-get-warp-history"
import type {GetWarpHistoryErrorCode} from "#shared/get-warp-history-error"

export class WarpsApi {
  constructor(
    private functions: Functions,
    private url: string,
  ) {}

  currentTicket?: string

  async validateUrl(): Promise<{ valid: boolean, errorCode?: GetWarpHistoryErrorCode | "invalidUrl" | "unknown" }> {
    let url: URL
    try {
      url = new URL(this.url)
    } catch (e) {
      return {
        valid: false,
        errorCode: "invalidUrl",
      }
    }

    if (!url.searchParams.has("authkey") || !url.searchParams.has("region")) {
      return {
        valid: false,
        errorCode: "invalidUrl",
      }
    }

    const params = new URLSearchParams({
      authKey: url.searchParams.get("authkey")!,
      region: url.searchParams.get("region")!,
    })
    const result = await fetch(`/api/v1/validateUrl?${params.toString()}`)

    if (!result.ok) {
      return {
        valid: false,
        errorCode: "unknown",
      }
    }

    const json = await result.json() as { success: boolean, errorCode?: GetWarpHistoryErrorCode }
    return {
      valid: json.success,
      errorCode: json.errorCode,
    }
  }

  async createTicket(lastIds: Record<string, string>, untilLatestRare: boolean): Promise<void> {
    const url = new URL(this.url)

    if (!url.searchParams.has("authkey") || !url.searchParams.has("region")) {
      throw new Error("Insufficient parameters")
    }

    const result = await httpsCallable<
      DispatchGetWarpHistoryParams,
      DispatchGetWarpHistoryResult
    >(this.functions, "dispatchGetWarpHistory")({
      authKey: url.searchParams.get("authkey")!,
      region: url.searchParams.get("region")!,
      lastIds,
      untilLatestRare,
    })

    this.currentTicket = result.data.ticket
  }
}
