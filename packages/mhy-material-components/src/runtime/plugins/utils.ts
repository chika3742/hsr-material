import { defineNuxtPlugin, useRouter } from "#imports"

export default defineNuxtPlugin((nuxt) => {
  const router = useRouter()
  const i18n = nuxt.vueApp.$nuxt.$i18n
  return {
    provide: {
      getPageTitle(path: string): string {
        const route = router.resolve(path)
        const titleKey = route.meta.title

        if (!titleKey) {
          return ""
        }

        const named: Record<string, string> = {}
        for (const key in route.params) {
          named[key] = i18n.t(`${route.meta.itemI18nKey}.${route.params[key] as string}`)
        }

        return i18n.t(`pageTitles.${titleKey}`, named)
      },
    },
  }
})
