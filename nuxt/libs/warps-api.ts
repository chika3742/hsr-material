import {Functions, httpsCallable} from "@firebase/functions"
import {DispatchGetWarpHistoryParams, DispatchGetWarpHistoryResult} from "#shared/dispatch-get-warp-history"

export class WarpsApi {
  constructor(
    private functions: Functions,
    private url: string,
  ) {}

  currentTicket?: string

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
