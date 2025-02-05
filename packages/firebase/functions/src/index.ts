import admin from "firebase-admin"
import "source-map-support/register"
import { initializeFirestore } from "firebase-admin/firestore";

const app = admin.initializeApp()
initializeFirestore(app, {
  preferRest: true,
})

export * from "./funcs/dispatch-get-warp-history.js"
export * from "./funcs/get-warp-history.js"
export * from "./funcs/on-user-delete.js"
export * from "./funcs/ticket-cleaner.js"
