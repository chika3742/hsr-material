<script lang="ts" setup>
import * as _ from "lodash"
import {Bookmark, LevelingBookmark} from "~/types/bookmark/bookmark"
import {CharacterIdWithVariant} from "~/types/strings"
import {reactive} from "#imports"
import {isBookmarkableExp} from "~/types/bookmarkable-ingredient"

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

</script>

<template>
  <v-card>
    <div class="d-flex flex-column pa-1">
      <!-- Character image/name row -->
      <div class="d-flex align-center">
        <div class="py-2 px-4 sortable-handle">
          <v-icon>mdi-drag-horizontal-variant</v-icon>
        </div>

        <v-list-item
          :title="tx(`characterNames.${character}`)"
          :to="localePath({path: `/characters/${toCharacterId(character)}`, query: {variant: toVariant(character) ?? undefined}})"
          class="d-flex flex-grow-1 pl-0"
        >
          <template #prepend>
            <v-img
              :src="getCharacterImage(toCharacterId(character), 'small')"
              aspect-ratio="1"
              class="mr-2"
              width="50px"
            />
          </template>
        </v-list-item>
      </div>

      <div class="pa-2 d-flex flex-column" style="gap: 8px">
        <section v-if="groupedBookmarks.characterMaterials.length >= 1">
          <div class="d-flex g-2 flex-wrap">
            <MaterialItem
              v-for="(materials, mId) in _.groupBy(groupedBookmarks.characterMaterials, 'materialId') as Record<string, (Bookmark.CharacterMaterial | Bookmark.Exp)[]>"
              :key="mId"
              :initial-selected-exp-item="isBookmarkableExp(materials[0]) ? materials[0].selectedItem : undefined"
              :items="materials"
              :purpose-types="['ascension', 'basicAttack', 'skill', 'talent', 'ultimate']"
            />
            <v-btn
              :text="tx('common.details')"
              class="align-self-center"
              prepend-icon="mdi-loupe"
              variant="text"
              @click="detailsDialog.items = groupedBookmarks.characterMaterials; detailsDialog.show = true"
            />
          </div>
        </section>

        <section v-if="Object.keys(groupedBookmarks.lightCones).length >= 1">
          <div class="d-flex flex-column" style="gap: 8px">
            <div v-for="[lcId, lcMaterials] in Object.entries(groupedBookmarks.lightCones)" :key="lcId">
              <v-list-item
                :prepend-avatar="getLightConeImage(lcId)"
                :subtitle="tx('searchRecordTypes.light-cone')"
                :title="tx(`lightConeNames.${lcId}`)"
                :to="localePath({path: `/light-cones/${lcId}`, query: {character}})"
                density="compact"
                lines="two"
                rounded
              />
              <div class="d-flex g-2 flex-wrap ml-4 mt-2">
                <MaterialItem
                  v-for="(materials, mId) in _.groupBy(lcMaterials, 'materialId') as Record<string, (Bookmark.LightConeMaterial | Bookmark.Exp)[]>"
                  :key="mId"
                  :initial-selected-exp-item="isBookmarkableExp(materials[0]) ? materials[0].selectedItem : undefined"
                  :items="materials"
                  :purpose-types="['ascension']"
                />

                <v-btn
                  :text="tx('common.details')"
                  class="align-self-center"
                  prepend-icon="mdi-loupe"
                  variant="text"
                  @click="detailsDialog.items = lcMaterials; detailsDialog.show = true"
                />
              </div>
            </div>
          </div>
        </section>

        <section v-if="groupedBookmarks.relicSets.length >= 1">
          <div class="d-flex flex-column" style="gap: 8px">
            <BookmarkRelic v-for="set in groupedBookmarks.relicSets" :key="set.id" :item="set" />
          </div>
        </section>

        <section v-if="groupedBookmarks.relicPieces.length >= 1">
          <div class="d-flex flex-column" style="gap: 8px">
            <BookmarkRelic v-for="piece in groupedBookmarks.relicPieces" :key="piece.id" :item="piece" />
          </div>
        </section>
      </div>

      <BookmarkDetailsDialog v-model="detailsDialog.show" :bookmarks="bookmarks" :items="detailsDialog.items" />
    </div>
  </v-card>
</template>

<style scoped lang="sass">

</style>
