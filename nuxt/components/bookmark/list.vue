<script lang="ts" setup>
/* This component must be rendered only on the client side. */

import {from, useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import Sortable from "sortablejs"
import {_db} from "~/dexie/db"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"
import {CharacterIdWithVariant} from "~/types/strings"

const config = useConfigStore()

const _bookmarkedCharacterIds = useObservable(from(liveQuery(() => {
  return _db.bookmarks.orderBy("characterId").uniqueKeys() as Promise<CharacterIdWithVariant[]>
})), {
  initialValue: [] as string[],
})

const bookmarkedCharacterIds = computed(() => {
  return _bookmarkedCharacterIds.value.toSorted((a, b) => {
    if (config.characterOrder.includes(a) && config.characterOrder.includes(b)) {
      return config.characterOrder.indexOf(a) - config.characterOrder.indexOf(b)
    } else if (config.characterOrder.includes(a)) {
      return -1
    } else if (config.characterOrder.includes(b)) {
      return 1
    } else {
      return 0
    }
  })
})

const saveCharacterSort = (ev: Sortable.SortableEvent) => {
  config.characterOrder = Array.from(ev.to.children).map(el => (el as HTMLElement).dataset.characterId!)
  void FirestoreProvider.instance?.sendLocalData()
}

</script>

<template>
  <div class="position-relative">
    <Draggable container-class="bookmark-cards-wrapper" @sort="saveCharacterSort">
      <BookmarkCharacterCard
        v-for="characterId in bookmarkedCharacterIds"
        :key="characterId"
        :data-character-id="characterId"
        :character="characterId"
        :show-farming-count="config.showFarmingCount"
      />
    </Draggable>

    <div v-if="Object.keys(bookmarkedCharacterIds).length === 0" class="no-bookmarks">
      {{ tx("bookmark.noBookmarks") }}
    </div>
  </div>
</template>

<style lang="sass">
.bookmark-cards-wrapper
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  grid-gap: 16px
  position: relative

.no-bookmarks
  position: absolute
  top: 64px
  left: 16px
  right: 16px
  text-align: center
</style>
