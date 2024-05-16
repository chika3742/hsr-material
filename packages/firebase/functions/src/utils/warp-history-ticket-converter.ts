import admin from "firebase-admin"
import {WarpHistoryTicket} from "../types/shared/warp-history-ticket"

export const warpHistoryTicketConverter: admin.firestore.FirestoreDataConverter<WarpHistoryTicket> = {
  toFirestore(warpHistoryTicket: WarpHistoryTicket): admin.firestore.DocumentData {
    return warpHistoryTicket
  },
  fromFirestore(snapshot: admin.firestore.QueryDocumentSnapshot): WarpHistoryTicket {
    return snapshot.data() as WarpHistoryTicket
  },
}
