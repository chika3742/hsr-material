export interface AlgoliaRecord extends Record<string, unknown> {
  objectID: string
  itemId: string
  name_ja: string
  name_en: string
  recordType: "character" | "light-cone" | "material" | "relic-set" | "relic-piece"
  url: string
  resultPriority: number
}
