<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <LevelSlider
        v-model="range"
        :slider-ticks="sliderTicks"
      />
      <MaterialItems
        :items="items"
        :range="range"
        :purpose-types="['ascension']"
        class="mt-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import type { LevelIngredients } from "~/types/level-ingredients"
import { db } from "~/libs/db/providers"
import type { BookmarkableIngredient } from "~/types/bookmark/bookmarkables"
import { type EachLevels, type Ingredient, isExpIngredient, type MaterialExpr } from "~/types/data/ingredient"
import characters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"

const props = defineProps<{
  title: string
  characterId: string
  lightConeId?: string
  levels: EachLevels<Ingredient[]>
  materialDefs: Record<string, MaterialExpr>
}>()

const config = useConfigStore()

const levelIngredients = computed(() => {
  return levelsToLevelIngredients(props.levels.levels)
})

const sliderTicks = computed(() => levelIngredientsToSliderTicks(levelIngredients.value))

const range = ref([sliderTicks.value[0], sliderTicks.value.slice(-1)[0]])

const setInitialRangeBasedOnGameData = () => {
  const character = characters.find(c => c.id === props.characterId)
  let maxAscension: number | null = null
  if (character && isCharacterGroup(character)) {
    for (const variant of character.variants) {
      const key = toCharacterIdWithVariant(props.characterId, variant.path)
      const asc = config.characterLevels[key]?.ascension
      if (asc === undefined) continue
      if (maxAscension === null || asc > maxAscension) {
        maxAscension = asc
      }
    }
  }
  const sliderLowerRange = maxAscension ?? sliderTicks.value[0]
  range.value = [sliderLowerRange, sliderTicks.value.slice(-1)[0]]
}

const setInitialRangeBasedOnBookmarks = async () => {
  if (import.meta.server) {
    return
  }

  const bookmarks = await db.bookmarks.getByPurpose(
    props.characterId,
    null,
    props.lightConeId,
    "ascension",
  )

  if (bookmarks.length !== 0) {
    const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)
    const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)

    range.value = [sliderTicks.value[sliderTicks.value.indexOf(min) - 1], max]
  } else {
    setInitialRangeBasedOnGameData()
  }
}
watch(toRefs(props).characterId, () => {
  void setInitialRangeBasedOnBookmarks()
}, { immediate: true })

const ingredientsWithinSelectedLevelRange = computed<LevelIngredients[]>(() => {
  return levelIngredients.value.filter(e => range.value[0] < e.level && e.level <= range.value[1])
})

const ingredientsToBookmarkableIngredients = (ingredients: LevelIngredients[]): BookmarkableIngredient[] => {
  const result: BookmarkableIngredient[] = []

  for (const lv of ingredients) {
    for (const e of lv.ingredients) {
      if (isExpIngredient(e)) {
        result.push({
          type: props.lightConeId ? "light_cone_exp" : "character_exp",
          characterId: props.characterId,
          exp: e.exp,
          usage: {
            type: "exp",
            lightConeId: props.lightConeId ?? null,
            purposeType: "ascension",
            upperLevel: lv.level,
          },
        })
        continue
      }

      const materialId = getMaterialIdFromIngredient(e, props.materialDefs)
      if (materialId === null) {
        continue // qty is zero
      }

      if (!props.lightConeId) { // character bookmark
        result.push({
          type: "character_material",
          characterId: props.characterId,
          materialId,
          quantity: e.quantity,
          usage: {
            type: "character",
            purposeType: "ascension",
            upperLevel: lv.level,
          },
        })
      } else { // light cone bookmark
        result.push({
          type: "light_cone_material",
          characterId: props.characterId,
          materialId,
          quantity: e.quantity,
          usage: {
            type: "light_cone",
            lightConeId: props.lightConeId,
            purposeType: "ascension",
            upperLevel: lv.level,
          },
        })
      }
    }
  }

  return result
}

const items = computed<BookmarkableIngredient[]>(() => {
  return ingredientsToBookmarkableIngredients(ingredientsWithinSelectedLevelRange.value)
})
</script>
