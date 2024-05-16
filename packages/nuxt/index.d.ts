import {RawLocation, RouteLocation} from "@intlify/vue-router-bridge"
import {Locale} from "@intlify/vue-i18n-bridge"
import {Auth} from "@firebase/auth"
import {Firestore} from "@firebase/firestore"
import {Functions} from "@firebase/functions"
import {Analytics} from "@firebase/analytics"

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
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $isTouchDevice: boolean
    // shim for volar
    localePath: (route: RawLocation | RouteLocation, locale?: Locale) => string
    switchLocalePath: (locale?: Locale) => string
  }
}

export {}
