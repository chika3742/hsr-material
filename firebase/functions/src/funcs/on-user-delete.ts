import functions from "firebase-functions"
import admin from "firebase-admin"

export const onUserDelete = functions.region("asia-northeast1")
  .auth.user()
  .onDelete(async(user) => {
    const db = admin.firestore()
    await db.recursiveDelete(db.doc(`users/${user.uid}`))
  })
