<script lang="ts" setup>
import * as _ from "lodash"
import {Bookmark, LevelingBookmark} from "~/types/bookmark/bookmark"
import {CharacterIdWithVariant} from "~/types/strings"
import {db} from "~/dexie/db"
import {reactive} from "#imports"

interface Props {
  character: CharacterIdWithVariant
  bookmarks: Bookmark[]
}

const props = defineProps<Props>()

interface BookmarkGroups {
  characterMaterials: (Bookmark.CharacterMaterial | Bookmark.Exp)[]
  lightCones: Record<string, (Bookmark.LightConeMaterial | Bookmark.Exp)[]>
  relicSets: Bookmark.RelicSet[]
  relicPieces: Bookmark.RelicPiece[]
}

const groupedBookmarks = computed(() => {
  const result: BookmarkGroups = {
    characterMaterials: [],
    lightCones: {},
    relicSets: [],
    relicPieces: [],
  }

  for (const bookmark of props.bookmarks) {
    switch (bookmark.type) {
      case "character_material":
      case "character_exp":
        result.characterMaterials.push(bookmark)
        break
      case "light_cone_material":
      case "light_cone_exp":
        (result.lightCones[bookmark.usage.lightConeId!] ||= []).push(bookmark)
        break
      case "relic_set":
        result.relicSets.push(bookmark)
        break
      case "relic_piece":
        result.relicPieces.push(bookmark)
        break
    }
  }

  return result
})

const detailsDialog = reactive({
  show: false,
  items: [] as LevelingBookmark[],
})

const removeBookmark = (id: number) => {
  db.removeBookmarks(id)
}

</script>

<template>
  <v-card>
    <div class="d-flex flex-column pa-1">
      <!-- Character image/name row -->
      <div class="d-flex align-center" style="gap: 8px">
        <v-img :src="getCharacterImage(toCharacterId(character), 'small')" aspect-ratio="1" max-width="50px" />
        <span>{{ tx(`characterNames.${character}`) }}</span>
      </div>

      <div class="pa-2 d-flex flex-column" style="gap: 8px">
        <section v-if="groupedBookmarks.characterMaterials.length >= 1">
          <v-row no-gutters style="gap: 8px">
            <MaterialCard
              v-for="(materials, mId) in _.groupBy(groupedBookmarks.characterMaterials, 'materialId') as Record<string, (Bookmark.CharacterMaterial | Bookmark.Exp)[]>"
              :key="mId"
              :initial-selected-exp-item="(materials[0] as any).selectedItem"
              :items="materials"
              :purpose-types="['ascension', 'basicAttack', 'skill', 'talent', 'ultimate']"
              show-details-button
              @click:details-button="detailsDialog.items = groupedBookmarks.characterMaterials; detailsDialog.show = true"
            />
          </v-row>
        </section>

        <section v-if="Object.keys(groupedBookmarks.lightCones).length >= 0">
          <div class="d-flex flex-column" style="gap: 8px">
            <div v-for="[lcId, lcMaterials] in Object.entries(groupedBookmarks.lightCones)" :key="lcId">
              <v-list-item
                :prepend-avatar="getLightConeImage(lcId)"
                :subtitle="tx('bookmarkTypes.light_cone')"
                :title="tx(`lightConeNames.${lcId}`)"
                :to="localePath({path: `/light-cones/${lcId}`, query: {character}})"
                density="compact"
                lines="two"
                rounded
              />
              <v-row class="ml-2 mt-2" no-gutters style="gap: 8px">
                <MaterialCard
                  v-for="(materials, mId) in _.groupBy(lcMaterials, 'materialId') as Record<string, (Bookmark.LightConeMaterial | Bookmark.Exp)[]>"
                  :key="mId"
                  :initial-selected-exp-item="(materials[0] as any).selectedItem"
                  :items="materials"
                  :purpose-types="['ascension']"
                  show-details-button
                  @click:details-button="detailsDialog.items = lcMaterials; detailsDialog.show = true"
                />
              </v-row>
            </div>
          </div>
        </section>

        <section v-if="groupedBookmarks.relicSets.length >= 1">
          <div class="d-flex flex-column" style="gap: 8px">
            <div v-for="set in groupedBookmarks.relicSets" :key="set.id">
              <v-list-item
                :prepend-avatar="getRelicSetImage(set.relicSetIds[0])"
                :subtitle="tx('bookmarkTypes.relic_set')"
                :title="tx(`relicSetTitles.${set.relicSetIds[0]}`)"
                :to="localePath({path: `/relics/${set.relicSetIds[0]}`})"
                density="compact"
                lines="two"
                rounded
              >
                <template #append>
                  <v-btn icon="mdi-bookmark-remove" variant="text" @click.prevent="removeBookmark(set.id!)" />
                </template>
              </v-list-item>

              <div class="ml-2">
                <p
                  v-for="[location, stat] in Object.entries(set.mainStats).filter(([_, _stat]) => _stat)"
                  :key="location"
                >
                  <span class="text-slight-heading" style="font-size: 0.9em">{{
                    tx("common.mainStatShort")
                  }}({{ tx(`relicLocations.${location}`) }}): </span>
                  <span>{{ tx(`stats.${stat}`) }}</span>
                </p>
                <p>
                  <span class="text-slight-heading" style="font-size: 0.9em">{{ tx("common.subStatShort") }}: </span>
                  <span>{{ set.subStats.map(e => tx(`stats.${e}`)).join(", ") }}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BookmarkDetailsDialog v-model="detailsDialog.show" :items="detailsDialog.items" />
    </div>
  </v-card>
</template>

<style scoped lang="sass">

</style>
