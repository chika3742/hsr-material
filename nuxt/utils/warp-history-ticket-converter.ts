import type {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from "@firebase/firestore"
import type {WarpHistoryTicket} from "#shared/warp-history-ticket"

export const warpHistoryTicketConverter: FirestoreDataConverter<WarpHistoryTicket> = {
  toFirestore(warpHistoryTicket: WarpHistoryTicket): DocumentData {
    return warpHistoryTicket
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): WarpHistoryTicket {
    return snapshot.data() as WarpHistoryTicket
  },
}
