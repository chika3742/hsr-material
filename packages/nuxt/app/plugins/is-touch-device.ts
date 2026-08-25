import { defineNuxtPlugin } from "#imports"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      get isTouchDevice() {
        if (import.meta.server) {
          return false
        }
        return "ontouchstart" in window || navigator.maxTouchPoints > 0
      },
    },
  }
})
