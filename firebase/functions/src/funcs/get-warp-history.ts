import functions from "firebase-functions"
import {WarpHistoryHandler} from "../lib/warp-history-handler.js"
import {GetWarpHistoryParams} from "../types/get-warp-history-params"

export const getWarpHistory = functions
  .region("asia-northeast1")
  .runWith({
    minInstances: 1,
  })
  .tasks.taskQueue({
    rateLimits: {
      maxConcurrentDispatches: 5,
    },
  }).onDispatch(async(data: GetWarpHistoryParams) => {
    await new WarpHistoryHandler().get(data)
  })
