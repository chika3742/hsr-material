declare module "nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    title: string
    itemI18nKey?: string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $isTouchDevice: boolean
  }
}

export {}
