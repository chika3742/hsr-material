<script lang="ts" setup>
import { from, useObservable } from "@vueuse/rxjs"
import { liveQuery } from "dexie"
import hash from "object-hash"
import { isEqual } from "lodash-es"
import type { PurposeType } from "~/types/strings"
import materials from "~/assets/data/materials.yaml"
import { computed } from "#imports"
import type { LevelingBookmark } from "~/types/bookmark/bookmark"
import { db } from "~/libs/db/providers"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"
import type { BookmarkableExp, BookmarkableIngredient, BookmarkableMaterial } from "~/types/bookmark/bookmarkables"
import { isBookmarkableExp } from "~/types/bookmark/bookmarkables"
import type { Material } from "~/types/data/src/materials"

interface Props {
  /**
   * `type` of the items must be the same.
   */
  items: BookmarkableIngredient[]
  /**
   * {@link Bookmark} id used for single bookmark.
   * If this is set, the item will be treated as a individual bookmark.
   */
  itemId?: number
  purposeTypes: PurposeType[]
  initialSelectedExpItem?: string
  showFarmingCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialSelectedExpItem: undefined,
  itemId: undefined,
})

const snackbar = useSnackbar()
const i18n = useI18n()
const config = useConfigStore()

const loading = ref(false)
const currentExpItemIndex = ref(0)

const farmingCountDivideByBase = 6

const expItems = computed(() => {
  const firstItem = props.items[0]
  if (!firstItem) return null
  if (firstItem.type === "character_exp") {
    return characterIngredients.expItems
  } else if (firstItem.type === "light_cone_exp") {
    return lightConeIngredients.expItems
  } else {
    return null
  }
})

const currentExpItem = computed(() => {
  return expItems.value?.[currentExpItemIndex.value] ?? null
})

const forwardExpItem = () => {
  currentExpItemIndex.value = (currentExpItemIndex.value + 1) % expItems.value!.length
}

const material = computed(() => {
  const firstItem = props.items[0]
  let result: Material | undefined
  if (firstItem && isBookmarkableExp(firstItem)) {
    result = materials.find(e => e.id === currentExpItem.value!.itemId)
  } else if (firstItem) {
    result = materials.find(e => e.id === firstItem.materialId)
  }
  if (typeof result === "undefined") {
    throw new Error("Material not found")
  }

  return result
})

const quantity = computed(() => {
  const firstItem = props.items[0]
  if (firstItem && isBookmarkableExp(firstItem)) {
    const items = props.items as BookmarkableExp[]
    const exp = items.reduce((acc, e) => acc + e.exp, 0)
    return Math.ceil(exp / currentExpItem.value!.expPerItem)
  } else {
    const items = props.items as BookmarkableMaterial[]
    return items.reduce((acc, e) => acc + e.quantity, 0)
  }
})

// Bookmarks
const savedBookmarks = (() => {
  if (import.meta.server) {
    return ref([])
  }

  const firstItem = props.items[0]
  if (typeof props.itemId !== "undefined" && firstItem) {
    return useObservable<LevelingBookmark[], null>(from(liveQuery(() => {
      return db.bookmarks.getLevelingItemByHash(hash(firstItem))
    })), {
      initialValue: null,
    })
  }

  return useObservable<LevelingBookmark[], null>(from(liveQuery(() =>
    db.bookmarks.getLevelingItems(
      props.items,
      props.purposeTypes,
      typeof props.itemId !== "undefined" && firstItem ? firstItem.usage.upperLevel : undefined,
    ))), {
    initialValue: null,
  })
})()

/**
 * Bookmark state
 * - full: the slider range and the bookmarked range are the same
 * - partial: the slider range and the bookmarked range are different but not empty
 * - none: no items are bookmarked
 */
const bookmarkState = computed<"full" | "partial" | "none" | undefined>(() => {
  if (import.meta.server) {
    return undefined
  }

  const bookmarks = savedBookmarks.value
  if (bookmarks === null) {
    return undefined
  }

  const diff1 = bookmarks.filter(a => !props.items.some(b => isEqual(a.usage, b.usage)))
  const diff2 = props.items.filter(a => !bookmarks.some(b => isEqual(a.usage, b.usage)))

  if (bookmarks.length !== 0 && diff1.length === 0 && diff2.length === 0) {
    return "full"
  } else if (bookmarks.length !== 0 && (diff1.length !== 0 || diff2.length !== 0)) {
    return "partial"
  } else {
    return "none"
  }
})

const farmingCountDivideBy = computed(() => {
  if (config.farmingCountDivision && getDropRateForMaterial(material.value.id)?.isChallengeableConsecutively) {
    return farmingCountDivideByBase
  }
  return undefined
})

const toggleBookmark = async () => {
  if (savedBookmarks.value === null) {
    return
  }

  loading.value = true

  try {
    if (bookmarkState.value === "none") {
      await db.bookmarks.addLevelingItems(props.items.map(e => JSON.parse(JSON.stringify(e)) as BookmarkableIngredient), material.value.id, props.itemId)
      snackbar.show(tx(i18n, "bookmark.bookmarked"))
    } else {
      const result = await db.bookmarks.remove(...savedBookmarks.value.map(e => e.id!))
      snackbar.show(tx(i18n, "bookmark.removed"), null, {
        text: tx(i18n, "common.undo"),
        onClick: () => {
          void db.bookmarks.bulkAdd(result)
        },
      })
    }
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "errors.bookmark"), "error")
  } finally {
    loading.value = false
  }
}

const reBookmark = async () => {
  loading.value = true

  try {
    await db.bookmarks.remove(...(savedBookmarks.value as LevelingBookmark[]).map(e => e.id!))
    await db.bookmarks.addLevelingItems(props.items, currentExpItem.value?.itemId)

    snackbar.show(tx(i18n, "bookmark.bookmarked"))
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "errors.bookmark"), "error")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <MaterialCard
    :name="localize(material.name)"
    :to="`/materials/${material.id}`"
    :loading="loading || bookmarkState === undefined"
    :bookmark-state="bookmarkState"
    :dimmed="typeof itemId !== 'undefined' && bookmarkState === 'none'"
    :show-item-toggle-button="items[0] ? isBookmarkableExp(items[0]) : false"
    :image-path="getMaterialImage(material.id)"
    :quantity="quantity"
    :rarity="material.rarity"
    :farming-count="showFarmingCount ? getFarmingCount(material.id, quantity) : null"
    :farming-count-divide-by="farmingCountDivideBy"
    @toggle-bookmark="toggleBookmark"
    @re-bookmark="reBookmark"
    @toggle-item="forwardExpItem"
  />
</template>
