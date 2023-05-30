import {BookmarkableItem} from "~/types/bookmarkable-ingredient"
import materials from "~/assets/data/materials.csv"

/**
 * Merges items in the list with the same material IDs and returns an array of arrays.
 *
 * If the item is an exp item, it will be merged into another exp item.
 *
 * @param items The {@link BookmarkableItem} list to merge
 * @returns The merged {@link BookmarkableItem} list
 */
export const mergeItems = (items: BookmarkableItem[]): BookmarkableItem[][] => {
  const result: BookmarkableItem[][] = []
  for (const item of items) {
    const existing = (() => {
      if (item.purposeType === "exp") {
        // If the item is an exp item, add into existing exp item (exp item does not have id)
        return result.find(e => e[0].purposeType === "exp")
      } else {
        // If the item has an id, add into existing item has the same id
        return result.find(e => e[0].purposeType !== "exp" && e[0]?.id === item.id)
      }
    })()
    if (existing) {
      existing.push(item)
    } else {
      result.push([item])
    }
  }

  /**
   * ソート順序について:
   * 1. 経験値アイテムは先頭に
   * 2. クレジットアイテムは末尾に
   * 3. groupId を持つアイテムを優先
   * 4. groupId の文字列でソート
   * 5. クラフトレベルの降順でソート
   * 6. id の文字列でソート
   */
  return result.sort((a, b) => {
    const aElement = a[0]
    const bElement = b[0]

    if (aElement.purposeType === "exp" || bElement.purposeType === "exp") {
      return aElement.purposeType === "exp" ? -1 : 1
    } else if (aElement.id === "credit" || bElement.id === "credit") {
      return aElement.id === "credit" ? 1 : -1
    } else {
      const aMaterial = materials.find(e => e.id === aElement.id)!
      const bMaterial = materials.find(e => e.id === bElement.id)!
      if (aMaterial.groupId && bMaterial.groupId) {
        if (aMaterial.groupId !== bMaterial.groupId) {
          return aMaterial.groupId.localeCompare(bMaterial.groupId)
        } else {
          return bMaterial.craftLevel! - aMaterial.craftLevel!
        }
      } else if (aMaterial.groupId || bMaterial.groupId) {
        return aMaterial.groupId ? -1 : 1
      } else {
        return aElement.id.localeCompare(bElement.id)
      }
    }
  })
}
