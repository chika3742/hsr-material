import type { LocalizedText } from "../locales"

export interface MaterialsMeta {
  categories: {
    id: string
    title: LocalizedText
  }[]
  expItemGroups: Record<string, {
    itemId: string
    expPerItem: number
  }[]>
}
