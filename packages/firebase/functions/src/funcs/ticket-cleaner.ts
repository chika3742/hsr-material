import functions, { logger } from "firebase-functions/v1"
import { firestoreCollections } from "../lib/firestore-collections.js"

const expiresIn = 1000 * 60 * 30 // 30 minutes

export const ticketCleaner = functions.region("asia-northeast1").pubsub
  .schedule("every 1 hours synchronized")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    const tickets = await firestoreCollections.warpHistoryTickets.get()
    let count = 0
    for (const ticket of tickets.docs) {
      const data = ticket.data()
      if (data.timestamp + expiresIn < new Date(context.timestamp).getTime()) {
        await ticket.ref.delete()
        count++
      }
    }

    logger.log(`Deleted ${count} ticket(s)`)
  })
