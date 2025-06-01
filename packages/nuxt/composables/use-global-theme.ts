import { useTheme } from "vuetify"

export default function useGlobalTheme() {
  const theme = useTheme()
  const config = useConfigStore()

  const updateCurrentTheme = () => {
    setTimeout(() => {
      theme.global.name.value = config.getCurrentTheme()
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
}
