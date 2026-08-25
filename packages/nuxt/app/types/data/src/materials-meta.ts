import type { LocalizedText } from "../locales"

export interface MaterialsMeta {
  categories: {
    id: string
    title: LocalizedText
  }[]
}
