export default function useGlobalTheme() {
  const config = useConfigStore()

  const currentTheme = ref("dark")

  const updateCurrentTheme = () => {
    setTimeout(() => {
      currentTheme.value = config.getCurrentTheme()
    })
  }

  watch(toRefs(config).theme, () => {
    updateCurrentTheme()
  }, { immediate: true })

  let mediaWatcher: MediaQueryList
  onMounted(() => {
    mediaWatcher = window.matchMedia("(prefers-color-scheme: dark)")
    // listen to theme change
    mediaWatcher.addEventListener("change", updateCurrentTheme)
  })

  onBeforeUnmount(() => {
    // remove the event listener
    mediaWatcher.removeEventListener("change", updateCurrentTheme)
  })

  return currentTheme
}
