import type {Composer} from "vue-i18n"
import type {Loc} from "~/types/generated/loc.g"

type Tx = {
  (key: Loc, named?: Record<string, unknown>): string
  /**
   * If you want to use this function outside the `template`,
   * you need to pass the i18n {@link Composer} instance as the first argument
   * using {@link useI18n}.
   */
  (i18nInstance: Composer, key: Loc, named?: Record<string, unknown>): string
}

export const tx: Tx = (arg1: Loc | Composer, arg2?: Record<string, unknown> | Loc, arg3?: Record<string, unknown>) => {
  let i18n: Composer
  let key: string
  let named: Record<string, unknown>

  if (typeof arg1 === "string") {
    i18n = useI18n()
    key = arg1
    named = (arg2 ?? {}) as Record<string, unknown>
  } else {
    i18n = arg1
    key = arg2 as string
    named = arg3 ?? {}
  }

  return i18n.t(key, named)
}
