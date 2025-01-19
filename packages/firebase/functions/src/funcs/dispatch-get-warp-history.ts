import { HttpsError, onCall } from "firebase-functions/v2/https"
import { getFunctions } from "firebase-admin/functions"
import { firestoreCollections } from "../lib/firestore-collections.js"
import type {
  DispatchGetWarpHistoryParams,
  DispatchGetWarpHistoryResult,
} from "../types/shared/dispatch-get-warp-history"
import type { GetWarpHistoryParams } from "../types/get-warp-history-params"
import { warpHistoryTicketConverter } from "../utils/warp-history-ticket-converter.js"
import { GachaLogRequest } from "../lib/gacha-log-request.js"

export const dispatchGetWarpHistory = onCall<DispatchGetWarpHistoryParams, Promise<DispatchGetWarpHistoryResult>>({
  region: "asia-northeast1",
  minInstances: 0,
}, async ({ app, data }) => {
  if (!app) {
    throw new HttpsError("failed-precondition", "Invalid App Check token.")
  }

  // https://github.com/firebase/firebase-admin-node/blob/master/src/utils/index.ts#L293
  const queue = getFunctions().taskQueue<GetWarpHistoryParams>("locations/asia-northeast1/functions/getWarpHistory")

  const doc = firestoreCollections.warpHistoryTickets.doc()
    .withConverter(warpHistoryTicketConverter)

  try {
    await doc.set({
      status: "processing",
      progress: {
        gachaCount: 0,
        gachaTypeCount: 1,
        gachaTypeTotal: GachaLogRequest.warpTypes.length,
      },
      timestamp: Date.now(),
    })
    await queue.enqueue({
      authKey: data.authKey,
      region: data.region,
      lastIds: data.lastIds,
      ticketId: doc.id,
      untilLatestRare: data.untilLatestRare,
    })
  } catch (error) {
    console.error(error)
    await doc.update({
      status: "error",
      errorCode: "internal",
    })
  }

  return {
    ticket: doc.id,
  }
})
