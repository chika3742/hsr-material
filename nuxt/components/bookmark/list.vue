<script lang="ts" setup>
/* This component must be rendered only on the client side. */

import {useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import _ from "lodash"
import {Bookmark} from "~/types/bookmark/bookmark"
import {_db} from "~/dexie/db"

const bookmarks = useObservable<Bookmark[], Bookmark[]>(liveQuery(() => _db.bookmarks.toArray()) as any, {
  initialValue: [],
})

const bookmarkCharacters = computed(() => {
  return _.groupBy(bookmarks.value, v => v.characterId)
})

</script>

<template>
  <div class="position-relative">
    <Draggable container-class="bookmark-cards-wrapper">
      <BookmarkCharacterCard
        v-for="(characterBookmarks, characterId) in bookmarkCharacters"
        :key="characterId"
        :bookmarks="characterBookmarks"
        :character="characterId"
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
