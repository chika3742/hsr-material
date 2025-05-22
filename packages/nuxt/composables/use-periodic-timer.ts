export const usePeriodicTimer = (callback: () => void, interval: number, immediate?: boolean) => {
  const timer = ref<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (timer.value) {
      clearInterval(timer.value)
    }
    timer.value = setInterval(() => {
      callback()
    }, interval)
    if (immediate) {
      callback()
    }
  }

  const stop = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  onBeforeUnmount(() => {
    stop()
  })

  return { start, stop }
}
