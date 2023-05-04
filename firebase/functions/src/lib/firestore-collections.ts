import admin from "firebase-admin"
import {warpHistoryTicketConverter} from "../utils/warp-history-ticket-converter.js"

export const firestoreCollections = {
  get warpHistoryTickets() {
    return admin.firestore().collection("warpHistoryTickets").withConverter(warpHistoryTicketConverter)
  },
}
