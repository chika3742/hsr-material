import { region } from "firebase-functions/v1"
import admin from "firebase-admin"

export const onUserDelete = region("asia-northeast1")
  .auth.user()
  .onDelete(async (user) => {
    const db = admin.firestore()
    await db.doc(`users/${user.uid}`).set({
      deletedAt: admin.firestore.Timestamp.now(),
    })
  })
