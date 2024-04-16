<script lang="ts" setup>
import relicPieces from "assets/data/relic-pieces.csv"
import relicSets from "assets/data/relic-sets.csv"
import type {Bookmark} from "~/types/bookmark/bookmark"
import {db} from "~/libs/db/providers"

interface Props {
  item: Bookmark.RelicSet | Bookmark.RelicPiece
}

const props = defineProps<Props>()

const snackbar = useSnackbar()
const i18n = useI18n()

const setIds = (() => {
  switch (props.item.type) {
    case "relic_set":
      return props.item.relicSetIds
    case "relic_piece":
      return [relicPieces.find(e => e.id === (props.item as Bookmark.RelicPiece).relicPieceId)!.setId]
  }
})()

const images = (() => {
  switch (props.item.type) {
    case "relic_set":
      return props.item.relicSetIds.map(e => getRelicSetImage(e))
    case "relic_piece":
      return [getRelicPieceImage(props.item.relicPieceId)]
  }
})()

const titleLines = (() => {
  switch (props.item.type) {
    case "relic_set": {
      const relicSet = relicSets.find(e => e.id === (props.item as Bookmark.RelicSet).relicSetIds[0])!
      const pcs = props.item.relicSetIds.length === 1 && relicSet.type === "cavern" ? "4pcs" : "2pcs"
      return props.item.relicSetIds.map(e => `${tx(i18n, `relicSetTitles.${e}`)} (${tx(i18n, `relicDetailsPage.${pcs}`)})`)
    }
    case "relic_piece":
      return [tx(i18n, `relicPieceNames.${props.item.relicPieceId}`)]
  }
})()

const subtitle = (() => {
  switch (props.item.type) {
    case "relic_set":
      return ""
    case "relic_piece":
      return tx(i18n, `relicSetTitles.${setIds[0]}`)
  }
})()

const mainStats = (() => {
  switch (props.item.type) {
    case "relic_set":
      return Object.entries(props.item.mainStats)
        .map(([location, stat]) => [`${tx("common.mainStatShort")}(${tx(i18n, `relicLocations.${location}`)})`, stat])
    case "relic_piece":
      return [[tx("common.mainStatShort"), props.item.mainStat]]
  }
})()

const showRelicSetMenu = ref(false)

const removeBookmark = async(id: number) => {
  const result = await db.bookmarks.remove(id)

  snackbar.show(tx(i18n, "bookmark.removed"), null, {
    text: tx(i18n, "common.undo"),
    onClick: () => {
      void db.bookmarks.bulkAdd(result)
    },
  })
}
</script>

<template>
  <div>
    <v-list-item
      :subtitle="subtitle"
      :to="setIds.length === 1 ? localePath({
        path: `/relics/${setIds[0]}`,
        query: {expansion_index: item.type === 'relic_piece' ? '1' : undefined},
      }) : undefined"
      density="compact"
      lines="two"
      link
      rounded
      @click="setIds.length >= 2 ? showRelicSetMenu = !showRelicSetMenu : undefined"
    >
      <template #prepend>
        <div>
          <v-img
            v-for="image in images"
            :key="image"
            :src="image"
            class="mr-2"
            aspect-ratio="1"
            width="32"
          />
        </div>
      </template>
      <template #title>
        <p v-for="line in titleLines" :key="line" style="white-space: pre-wrap">
          {{ line }}
        </p>
      </template>
      <template #append>
        <v-btn icon="mdi-bookmark-remove" variant="text" @click.prevent="removeBookmark(item.id!)" />
      </template>

      <v-menu v-model="showRelicSetMenu" :open-on-click="false" activator="parent">
        <v-list>
          <v-list-item
            v-for="id in setIds"
            :key="id"
            :prepend-avatar="getRelicSetImage(id)"
            :title="tx(`relicSetTitles.${id}`)"
            :to="localePath(`/relics/${id}`)"
          />
        </v-list>
      </v-menu>
    </v-list-item>

    <div class="ml-2">
      <p v-for="[heading, stat] in mainStats.filter(([_, _stat]) => _stat)" :key="heading">
        <span class="text-slight-heading" style="font-size: 0.9em">{{ heading }}: </span>
        <span>{{ tx(`stats.${stat}`) }}</span>
      </p>
      <p v-if="item.subStats.length >= 1">
        <span class="text-slight-heading" style="font-size: 0.9em">{{ tx("common.subStatShort") }}: </span>
        <span>{{ item.subStats.map(e => tx(`stats.${e}`)).join(", ") }}</span>
      </p>
    </div>

    <v-divider class="mt-2" />
  </div>
</template>

<style scoped lang="sass">

</style>
