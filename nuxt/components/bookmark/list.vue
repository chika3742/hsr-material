<script lang="ts" setup>
/* This component must be rendered only on the client side. */

import {useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
import {db} from "~/dexie/db"
import {Bookmark} from "~/types/bookmark/bookmark"

const bookmarkCharacters = useObservable<BookmarkCharacter[], BookmarkCharacter[]>(liveQuery(() => db.bookmarkCharacters.toArray()) as any, {
  initialValue: [],
})
const bookmarks = useObservable<Bookmark[], Bookmark[]>(liveQuery(() => db.bookmarks.toArray()) as any, {
  initialValue: [],
})
</script>

<template>
  <div class="bookmark-cards-wrapper">
    <CharacterBookmarkCard
      v-for="character in bookmarkCharacters"
      :key="character.characterId"
      :bookmarks="bookmarks.filter(e => character.bookmarks.includes(e.id!))"
      :character="character.characterId"
    />
  </div>
</template>

<style lang="sass" scoped>
.bookmark-cards-wrapper
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  grid-gap: 16px
</style>
