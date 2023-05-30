export default defineNuxtPlugin(() => {
  return {
    provide: {
      get isTouchDevice() {
        if (process.server) {
          return false
        }
        return "ontouchstart" in window || navigator.maxTouchPoints > 0
      },
    },
  }
})
