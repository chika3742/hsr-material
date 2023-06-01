export const getPageTitle = (url: string, router = useRouter(), i18n = useI18n()) => {
  const route = router.resolve(url)
  const titleKey = route.meta.title

  if (!titleKey) {
    return ""
  }

  const named: Record<string, string> = {}
  for (const key in route.params) {
    named[key] = tx(i18n, `${route.meta.itemI18nKey}.${route.params[key]}`)
  }

  return tx(i18n, `pageTitles.${titleKey}`, named)
}
