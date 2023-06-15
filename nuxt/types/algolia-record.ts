export interface AlgoliaRecord {
  objectID: string
  itemId: string
  name_ja: string
  name_en: string
  i18nKey: string
  recordType: "character" | "light-cone" | "material" | "relic-set" | "relic-piece"
  url: string
}
