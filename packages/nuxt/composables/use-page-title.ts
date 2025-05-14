export const usePageTitle = (title?: MaybeRef<string>): Ref<string> => {
  const titleState = useState("page_title", () => toValue(title) ?? "")

  if (title) {
    onActivated(() => {
      titleState.value = toValue(title)
    })
    // support reactivity
    if (isRef(title)) {
      watch(title, () => {
        titleState.value = toValue(title)
      })
    }
  }

  return titleState
}
