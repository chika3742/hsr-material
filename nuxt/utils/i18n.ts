import {Loc} from "~/types/generated/loc.g"

export const tx = (key: Loc, named: Record<string, unknown> = {}) => {
  const i18n = useI18n()
  return i18n.t(key, named)
}
