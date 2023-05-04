import {DispatchGetWarpHistoryParams} from "./shared/dispatch-get-warp-history"

export interface GetWarpHistoryParams extends DispatchGetWarpHistoryParams {
  ticketId: string
}
