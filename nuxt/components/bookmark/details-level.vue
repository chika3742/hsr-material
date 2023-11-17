<script lang="ts" setup>
import _ from "lodash"
import {from, useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import {db} from "~/libs/db/providers"
import type {BookmarkableIngredient} from "~/types/bookmark/bookmarkables"
import {isBookmarkableExp} from "~/types/bookmark/bookmarkables"
import type {PurposeType} from "~/types/strings"
import type {LevelingBookmark} from "~/types/bookmark/bookmark"

interface Props {
  items: LevelingBookmark[]
  level: number
  purpose: PurposeType
  loadingLevel: string | null
  showFarmingCount?: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: "removeBookmarksInLevel", data: { purpose: PurposeType, level: number }): void
}

defineEmits<Emits>()

const bookmarkedItemCount = process.client
  ? useObservable(from(liveQuery(() => {
    return db.bookmarks.bookmarks.where("id").anyOf(_.flatMap(props.items, e => e.id!)).count()
  })), {
    initialValue: 1,
  })
  : ref(1)
</script>

<template>
  <li>
    <v-row align="center" class="mb-2" no-gutters>
      <h3 class="text-slight-heading">
        Lv. {{ level }}
      </h3>
      <v-btn
        :disabled="loadingLevel !== `${purpose}-${level}` && bookmarkedItemCount === 0"
        :loading="loadingLevel === `${purpose}-${level}`"
        class="ml-1"
        prepend-icon="mdi-marker-check"
        variant="text"
        @click="$emit('removeBookmarksInLevel', {purpose, level})"
      >
        <span>{{ tx('bookmark.completeLeveling') }}</span>

        <!-- complete leveling button hint -->
        <v-tooltip activator="parent" location="bottom" open-delay="200">
          <span>{{ tx("bookmark.completeLevelingDesc") }}</span>
        </v-tooltip>
      </v-btn>
    </v-row>
    <v-lazy min-height="50px">
      <div class="material-cards-container">
        <MaterialItem
          v-for="item in items"
          :key="item.id"
          :initial-selected-exp-item="isBookmarkableExp(item) ? item.selectedItem : undefined"
          :item-id="item.id"
          :items="[_.omit(item, ['id', 'bookmarkedAt', 'selectedItem', 'hash']) as BookmarkableIngredient]"
          :purpose-types="[purpose]"
          :show-farming-count="showFarmingCount"
          individual
        />
      </div>
    </v-lazy>
  </li>
</template>

<style lang="sass" scoped>
.material-cards-container
  display: flex
  flex-wrap: wrap
  gap: 8px
</style>
