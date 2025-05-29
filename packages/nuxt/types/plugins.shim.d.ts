import type { Directive } from "vue"
import type { SafeAreaOptions } from "~/plugins/safe-area-directive"

declare module "vue" {
  export interface ComponentCustomProperties {
    $characterSelectItems: { id: string, name: string, image: string }[]
    $isTouchDevice: boolean
  }
  export interface GlobalDirectives {
    vSafeArea: Directive<HTMLElement, SafeAreaOptions>
  }
}

export {}
