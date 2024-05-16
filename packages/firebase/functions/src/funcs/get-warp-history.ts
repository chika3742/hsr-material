import {onTaskDispatched} from "firebase-functions/v2/tasks"
import {WarpHistoryHandler} from "../lib/warp-history-handler.js"
import {GetWarpHistoryParams} from "../types/get-warp-history-params"

export const getWarpHistory = onTaskDispatched<GetWarpHistoryParams>({
  region: "asia-northeast1",
  rateLimits: {
    maxConcurrentDispatches: 5,
  },
}, async({data}) => {
  await new WarpHistoryHandler().get(data)
})
