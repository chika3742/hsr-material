import {GetWarpHistoryParams} from "../types/get-warp-history-params"
import {warpHistoryTicketConverter} from "../utils/warp-history-ticket-converter.js"
import {GetWarpHistoryError} from "../types/shared/get-warp-history-error.js"
import {firestoreCollections} from "./firestore-collections.js"
import {GachaLogRequest} from "./gacha-log-request.js"

export class WarpHistoryHandler {
  get(params: GetWarpHistoryParams) {
    const doc = firestoreCollections.warpHistoryTickets.doc(params.ticketId)
      .withConverter(warpHistoryTicketConverter)

    return new GachaLogRequest(params, async(progress) => {
      await firestoreCollections.warpHistoryTickets.doc(doc.id).update({
        count: progress,
      })
    }).getGachaLogForAllWarpTypes().then((result) => {
      return doc.update({
        status: "done",
        count: result.length,
        result,
      })
    }).catch((error) => {
      console.error(error)

      if (error instanceof GetWarpHistoryError) {
        return doc.update({
          status: "error",
          errorCode: error.code,
        })
      } else {
        return doc.update({
          status: "error",
          errorCode: "internal",
        })
      }
    })
  }
}
