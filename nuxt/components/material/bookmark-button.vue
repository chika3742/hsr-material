<script lang="ts" setup>
import {useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import _ from "lodash"
import {db} from "~/dexie/db"
import {BookmarkableIngredient} from "~/types/bookmarkable-ingredient"
import {LevelingBookmark} from "~/types/bookmark/bookmark"
import {PurposeType} from "~/types/strings"

interface Props {
  items: BookmarkableIngredient[]
  purposeTypes: PurposeType[]
  selectedItem: string | undefined
  individual?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  individual: false,
})

// Bookmarks
const savedBookmarks = process.client
  ? useObservable<LevelingBookmark[], null>(liveQuery(() =>
    db.getLevelingBookmarks(
      props.items,
      props.purposeTypes,
      props.individual ? props.items[0].usage.upperLevel : undefined,
    )) as any, {
    initialValue: null,
  })
  : ref([])

/**
 * Bookmark state
 * - full: the slider range and the bookmarked range are the same
 * - partial: the slider range and the bookmarked range are different but not empty
 * - none: no items are bookmarked
 */
const bookmarkState = computed<"full" | "partial" | "none" | "loading">(() => {
  if (process.server) {
    return "none"
  }

  const bookmarks = savedBookmarks.value
  if (bookmarks === null) {
    return "loading"
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

const loading = ref(false)
const showBookmarkMenu = ref(false)
const snackbar = useSnackbar()
const i18n = useI18n()

const toggleBookmark = async() => {
  if (savedBookmarks.value === null) {
    return
  }

  loading.value = true

  try {
    if (bookmarkState.value === "none") {
      await db.addLevelingBookmarks(props.items.map(e => toRaw(e)), props.selectedItem)
      snackbar.show(tx(i18n, "bookmark.bookmarked"))
    } else {
      await db.removeBookmarks(...savedBookmarks.value.map(e => e.id!))
      snackbar.show(tx(i18n, "bookmark.removed"))
    }
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "errors.bookmark"))
  } finally {
    loading.value = false
  }
}

const reBookmark = () => {
  loading.value = true

  try {
    db.removeBookmarks(...(savedBookmarks.value as LevelingBookmark[]).map(e => e.id!))
    db.addLevelingBookmarks(props.items, props.selectedItem)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const buttonIcon = computed(() => {
  switch (bookmarkState.value) {
    case "full":
      return "mdi-bookmark-check"
    case "partial":
      return "mdi-bookmark-minus"
    default:
      return "mdi-bookmark"
  }
})

const buttonIconColor = computed(() => {
  switch (bookmarkState.value) {
    case "full":
      return "bookmarked"
    case "partial":
      return "partially-bookmarked"
    default:
      return undefined
  }
})
</script>

<template>
  <client-only>
    <v-btn
      :disabled="bookmarkState === 'loading'"
      :loading="loading"
      class="my-n2 mr-n2"
      icon
      size="small"
      variant="text"
      @click.prevent="bookmarkState === 'partial' ? showBookmarkMenu = true : toggleBookmark()"
    >
      <v-icon
        :color="buttonIconColor"
        :icon="buttonIcon"
      />

      <v-menu v-model="showBookmarkMenu" :open-on-click="false" activator="parent">
        <v-list density="comfortable">
          <v-list-item
            lines="two"
            prepend-icon="mdi-bookmark-check"
            :subtitle="tx('bookmark.reBookmarkDesc')"
            :title="tx('bookmark.reBookmark')"
            @click="reBookmark"
          />
          <v-list-item
            lines="two"
            prepend-icon="mdi-delete"
            :subtitle="tx('bookmark.unBookmarkDesc')"
            :title="tx('bookmark.unBookmark')"
            @click="toggleBookmark"
          />
        </v-list>
      </v-menu>
    </v-btn>
  </client-only>
</template>

<style lang="sass" scoped>

</style>
