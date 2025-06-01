export const getCurrentGame = (): "genshin" | "hsr" | null => {
  const { $i18n } = useNuxtApp()
  const isDefaultLocale = $i18n.locale.value === $i18n.defaultLocale

  const pathSegments = useRoute().path.split("/").filter(Boolean)
  if (!isDefaultLocale) {
    // If the locale is not the default, we need to remove the locale segment from the path
    pathSegments.shift()
  }
  if (pathSegments[0] === "genshin") {
    return "genshin"
  } else if (pathSegments[0] === "hsr") {
    return "hsr"
  } else {
    return null
  }
}
