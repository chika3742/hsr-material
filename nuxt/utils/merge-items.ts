import _ from "lodash"
import materials from "~/assets/data/materials.csv"

import type {BookmarkableIngredient} from "~/types/bookmark/bookmarkables"
import {isBookmarkableExp} from "~/types/bookmark/bookmarkables"

/**
 * Merges items in the list with the same material IDs and returns an array of arrays.
 *
 * If the item is an exp item, it will be merged into another exp item.
 *
 * @param items The {@link BookmarkableIngredient} list to merge
 * @returns The merged {@link BookmarkableIngredient} list
 */
export const mergeItems = (items: BookmarkableIngredient[]): BookmarkableIngredient[][] => {
  const result: BookmarkableIngredient[][] = []
  for (const item of items) {
    const existing = (() => {
      if (isBookmarkableExp(item)) {
        // If the item is an exp item, add into existing exp item (exp item does not have id)
        return result.find(e => isBookmarkableExp(e[0]))
      } else {
        // If the item has an id, add into existing item has the same id
        return result.find(e => !isBookmarkableExp(e[0]) && e[0].materialId === item.materialId)
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
  return result.sort(materialSortFunc)
}

export const materialSortFunc = (a: BookmarkableIngredient | BookmarkableIngredient[], b: BookmarkableIngredient | BookmarkableIngredient[]): number => {
  const aElement = _.isArray(a) ? a[0] : a
  const bElement = _.isArray(b) ? b[0] : b

  if (isBookmarkableExp(aElement) || isBookmarkableExp(bElement)) {
    return isBookmarkableExp(aElement) ? -1 : 1
  } else if (aElement.materialId === "credit" || bElement.materialId === "credit") {
    return aElement.materialId === "credit" ? 1 : -1
  } else {
    const aMaterial = materials.find(e => e.id === aElement.materialId)!
    const bMaterial = materials.find(e => e.id === bElement.materialId)!
    if (aMaterial.groupId && bMaterial.groupId) {
      if (aMaterial.groupId !== bMaterial.groupId) {
        return aMaterial.groupId.localeCompare(bMaterial.groupId)
      } else {
        return bMaterial.craftLevel! - aMaterial.craftLevel!
      }
    } else if (aMaterial.groupId || bMaterial.groupId) {
      return aMaterial.groupId ? -1 : 1
    } else {
      return aElement.materialId.localeCompare(bElement.materialId)
    }
  }
}
