import type { RawLocation, RouteLocation } from "@intlify/vue-router-bridge"
import type { Locale } from "@intlify/vue-i18n-bridge"
import type { Auth } from "@firebase/auth"
import type { Firestore } from "@firebase/firestore"
import type { Functions } from "@firebase/functions"
import type { Analytics } from "@firebase/analytics"
import type { LiteClient } from "algoliasearch/lite"

declare module "nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    title: string
    itemI18nKey?: string
  }
}

declare module "#app" {
  interface NuxtApp {
    $auth: Auth
    $firestore: Firestore
    $functions: Functions
    $analytics: Analytics
    $algoliaClient: LiteClient
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    readonly $isTouchDevice: boolean
    // shim for volar
    $localePath: (route: RawLocation | RouteLocation, locale?: Locale) => string
    $switchLocalePath: (locale?: Locale) => string
  }
}

export {}
