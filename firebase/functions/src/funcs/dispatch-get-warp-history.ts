import functions from "firebase-functions"
import {getFunctions} from "firebase-admin/functions"
import {firestoreCollections} from "../lib/firestore-collections.js"
import {DispatchGetWarpHistoryParams, DispatchGetWarpHistoryResult} from "../types/shared/dispatch-get-warp-history"
import {GetWarpHistoryParams} from "../types/get-warp-history-params"
import {warpHistoryTicketConverter} from "../utils/warp-history-ticket-converter.js"

export const dispatchGetWarpHistory = functions
  .region("asia-northeast1")
  .runWith({
    minInstances: 1,
  })
  .https.onCall((data: DispatchGetWarpHistoryParams, context): Promise<DispatchGetWarpHistoryResult> => {
    if (!context.app) {
      throw new functions.https.HttpsError("failed-precondition", "Invalid App Check token.")
    }

    // https://github.com/firebase/firebase-admin-node/blob/master/src/utils/index.ts#L293
    const queue = getFunctions().taskQueue<GetWarpHistoryParams>("locations/asia-northeast1/functions/getWarpHistory")

    const doc = firestoreCollections.warpHistoryTickets.doc()
      .withConverter(warpHistoryTicketConverter)

    return doc.set({
      status: "processing",
      count: 0,
      timestamp: Date.now(),
    }).then(() => {
      return queue.enqueue({
        authKey: data.authKey,
        region: data.region,
        lastIds: data.lastIds,
        ticketId: doc.id,
        untilLatestRare: data.untilLatestRare,
      })
    }).then(() => ({
      ticket: doc.id,
    })).catch(async(error) => {
      console.error(error)
      await doc.update({
        status: "error",
        errorCode: "internal",
      })

      return {
        ticket: doc.id,
      }
    })
  })
