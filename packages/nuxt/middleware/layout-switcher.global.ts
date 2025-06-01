export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp()
  const isDefaultLocale = $i18n.locale.value === $i18n.defaultLocale

  const pathSegments = to.path.split("/").filter(Boolean)
  if (!isDefaultLocale) {
    // If the locale is not the default, we need to remove the locale segment from the path
    pathSegments.shift()
  }
  if (pathSegments[0] === "genshin") {
    to.meta.layout = "genshin"
  } else if (pathSegments[0] === "hsr") {
    to.meta.layout = "hsr"
  } else {
    to.meta.layout = "global"
  }
})
