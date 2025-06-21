import type { Directive } from "vue"
import { clone, defaults } from "lodash-es"
import { defineNuxtPlugin } from "#imports"

export interface SafeAreaOptions {
  /**
   * Whether to insert a safe area inset in the specific direction.
   * You can also specify a minimum value by passing a numerical value.
   * @default false
   */
  top?: boolean | number
  /**
   * Whether to insert a safe area inset in the specific direction.
   * You can also specify a minimum value by passing a numerical value.
   * @default false
   */
  right?: boolean | number
  /**
   * Whether to insert a safe area inset in the specific direction.
   * You can also specify a minimum value by passing a numerical value.
   * @default false
   */
  bottom?: boolean | number
  /**
   * Whether to insert a safe area inset in the specific direction.
   * You can also specify a minimum value by passing a numerical value.
   * @default false
   */
  left?: boolean | number
}

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive("safe-area", <Directive<HTMLElement, SafeAreaOptions>>{
    mounted(el, binding) {
      const params = clone(binding.value)
      defaults(params, {
        top: false,
        right: false,
        bottom: false,
        left: false,
      })
      if (params.top !== false) {
        el.style.paddingTop = `max(env(safe-area-inset-top), ${typeof binding.value?.top === "number" ? binding.value?.top : 0}px)`
      }
      if (params.right !== false) {
        el.style.paddingRight = `max(env(safe-area-inset-right), ${typeof binding.value?.right === "number" ? binding.value?.right : 0}px)`
      }
      if (params.bottom !== false) {
        el.style.paddingBottom = `max(env(safe-area-inset-bottom), ${typeof binding.value?.bottom === "number" ? binding.value?.bottom : 0}px)`
      }
      if (params.left !== false) {
        el.style.paddingLeft = `max(env(safe-area-inset-left), ${typeof binding.value?.left === "number" ? binding.value?.left : 0}px)`
      }
    },
  })
})
