<script lang="ts" setup>
import {from, useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import _ from "lodash"
import hash from "object-hash"
import type {PurposeType} from "~/types/strings"
import materials from "~/assets/data/materials.csv"
import {computed} from "#imports"
import type {LevelingBookmark} from "~/types/bookmark/bookmark"
import {db} from "~/libs/db/providers"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"
import type {BookmarkableExp, BookmarkableIngredient, BookmarkableMaterial} from "~/types/bookmark/bookmarkables"
import {isBookmarkableExp, isBookmarkableMaterial} from "~/types/bookmark/bookmarkables"

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

const loading = ref(false)

const getRarity = (materialId: string) => {
  const material = materials.find(e => e.id === materialId)!
  return material.rarity
}

const quantity = computed(() => {
  if (isBookmarkableExp(props.items[0])) {
    const items = props.items as BookmarkableExp[]
    return items.reduce((acc, e) => acc + e.exp, 0)
  } else {
    const items = props.items as BookmarkableMaterial[]
    return items.reduce((acc, e) => acc + e.quantity, 0)
  }
})

const expItemLineup = computed(() => {
  switch (props.items[0].type) {
    case "character_exp":
      return characterIngredients.expItems
    case "light_cone_exp":
      return lightConeIngredients.expItems
    default:
      return []
  }
})

// Bookmarks
const savedBookmarks = (() => {
  if (process.server) {
    return ref([])
  }

  if (typeof props.itemId !== "undefined") {
    return useObservable<LevelingBookmark[], null>(from(liveQuery(() => {
      return db.bookmarks.getLevelingItemByHash(hash(props.items[0]))
    })), {
      initialValue: null,
    })
  }

  return useObservable<LevelingBookmark[], null>(from(liveQuery(() =>
    db.bookmarks.getLevelingItems(
      props.items,
      props.purposeTypes,
      typeof props.itemId !== "undefined" ? props.items[0].usage.upperLevel : undefined,
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
  if (process.server) {
    return undefined
  }

  const bookmarks = savedBookmarks.value
  if (bookmarks === null) {
    return undefined
  }

  const diff1 = bookmarks.filter(a => !props.items.some(b => _.isEqual(a.usage, b.usage)))
  const diff2 = props.items.filter(a => !bookmarks.some(b => _.isEqual(a.usage, b.usage)))

  if (bookmarks.length !== 0 && diff1.length === 0 && diff2.length === 0) {
    return "full"
  } else if (bookmarks.length !== 0 && (diff1.length !== 0 || diff2.length !== 0)) {
    return "partial"
  } else {
    return "none"
  }
})

const toggleBookmark = async(selectedExpItemId: string | undefined) => {
  if (savedBookmarks.value === null) {
    return
  }

  loading.value = true

  try {
    if (bookmarkState.value === "none") {
      await db.bookmarks.addLevelingItems(props.items.map(e => JSON.parse(JSON.stringify(e)) as BookmarkableIngredient), selectedExpItemId, props.itemId)
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

const reBookmark = async(selectedExpItemId: string | undefined) => {
  loading.value = true

  try {
    await db.bookmarks.remove(...(savedBookmarks.value as LevelingBookmark[]).map(e => e.id!))
    await db.bookmarks.addLevelingItems(props.items, selectedExpItemId)

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
    :bookmark-button-loading="loading"
    :bookmark-state="bookmarkState"
    :dimmed="typeof itemId !== 'undefined' && bookmarkState === 'none'"
    :exp-item-lineup="expItemLineup"
    :initial-selected-exp-item-id="initialSelectedExpItem"
    :is-exp-item="isBookmarkableExp(items[0])"
    :material-id="isBookmarkableMaterial(items[0]) ? items[0].materialId : undefined"
    :material-image="getMaterialImage"
    :quantity="quantity"
    :rarity="getRarity"
    :farming-count="showFarmingCount ? getFarmingCount : undefined"
    @toggle-bookmark="toggleBookmark"
    @re-bookmark="reBookmark"
  />
</template>
