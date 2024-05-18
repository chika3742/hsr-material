import type { Warp } from "./warp"
import type { GetWarpHistoryErrorCode } from "./get-warp-history-error"

export interface WarpGettingProgress {
  gachaCount: number
  gachaTypeCount: number
  gachaTypeTotal: number
}

export interface WarpHistoryTicket {
  status: "processing" | "done" | "error"
  progress: WarpGettingProgress
  timestamp: number
  result?: Warp[]
  errorCode?: GetWarpHistoryErrorCode
}
