import {Warp} from "./warp"
import {GetWarpHistoryErrorCode} from "./get-warp-history-error"

export interface WarpHistoryTicket {
  status: "processing" | "done" | "error",
  count: number,
  timestamp: number,
  result?: Warp[],
  errorCode?: GetWarpHistoryErrorCode,
}
