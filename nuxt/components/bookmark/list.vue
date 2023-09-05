<script lang="ts" setup>
/* This component must be rendered only on the client side. */

import {useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import _ from "lodash"
import Sortable from "sortablejs"
import {Bookmark} from "~/types/bookmark/bookmark"
import {_db} from "~/dexie/db"
import {useConfigStore} from "~/store/config"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"

const config = useConfigStore()

const bookmarks = useObservable<Bookmark[], Bookmark[]>(liveQuery(() => _db.bookmarks.toArray()) as any, {
  initialValue: [],
})

const bookmarkCharacters = computed(() => {
  return Object.fromEntries(Object.entries(_.groupBy(bookmarks.value, v => v.characterId)).sort((a, b) => {
    const [aId] = a
    const [bId] = b

    if (config.characterOrder.includes(aId) && config.characterOrder.includes(bId)) {
      return config.characterOrder.indexOf(aId) - config.characterOrder.indexOf(bId)
    } else if (config.characterOrder.includes(aId)) {
      return -1
    } else if (config.characterOrder.includes(bId)) {
      return 1
    } else {
      return 0
    }
  }))
})

const saveCharacterSort = (ev: Sortable.SortableEvent) => {
  config.characterOrder = Array.from(ev.to.children).map(el => (el as HTMLElement).dataset.characterId!)
  FirestoreProvider.instance?.sendLocalData()
}

</script>

<template>
  <div class="position-relative">
    <Draggable container-class="bookmark-cards-wrapper" @sort="saveCharacterSort">
      <BookmarkCharacterCard
        v-for="(characterBookmarks, characterId) in bookmarkCharacters"
        :key="characterId"
        :data-character-id="characterId"
        :bookmarks="characterBookmarks"
        :character="characterId as string"
      />
    </Draggable>

    <div v-if="Object.keys(bookmarkCharacters).length === 0" class="no-bookmarks">
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
