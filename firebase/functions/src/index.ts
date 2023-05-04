import admin from "firebase-admin"

admin.initializeApp()

export * from "./funcs/dispatch-get-warp-history.js"
export * from "./funcs/get-warp-history.js"
export * from "./funcs/on-user-delete.js"
export * from "./funcs/ticket-cleaner.js"
