import {BookmarkableItem} from "~/types/bookmarkable-ingredient"

/**
 * Merges items with the same id and returns a new array
 * @param items The ingredients to merge
 */
export const mergeItems = (items: BookmarkableItem[]): BookmarkableItem[][] => {
  const result: BookmarkableItem[][] = []
  for (const item of items) {
    const existing = (() => {
      if (item.purposeType === "exp") {
        return result.find(e => e[0].purposeType === "exp")
      } else {
        return result.find(e => e[0].purposeType !== "exp" && e[0]?.id === item.id)
      }
    })()
    if (existing) {
      existing.push(item)
    } else {
      result.push([item])
    }
  }
  return result
}
