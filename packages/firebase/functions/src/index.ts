import admin from "firebase-admin"
import { initializeFirestore } from "firebase-admin/firestore"

const app = admin.initializeApp()
initializeFirestore(app, {
  preferRest: true,
})

export * from "./funcs/on-user-delete.js"
