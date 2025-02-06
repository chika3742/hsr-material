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
import type { CharacterMaterialDefinitions, Path } from "~/types/generated/characters.g"
import type { LightConeMaterialDefinitions } from "~/types/generated/light-cones.g"
import type { LevelIngredients } from "~/types/level-ingredients"
import type { Usage } from "~/types/bookmark/usage"
import { db } from "~/libs/db/providers"
import type { BookmarkableExp, BookmarkableIngredient, BookmarkableMaterial } from "~/types/bookmark/bookmarkables"
import type { LevelsObject } from "~/types/generated/character-ingredients.g"

const props = defineProps<{
  title: string
  characterId: string
  lightConeId?: string
  levels: LevelsObject
  variant: Path | null
  materialDefs: CharacterMaterialDefinitions | LightConeMaterialDefinitions
}>()

const config = useConfigStore()

const levelIngredients = computed(() => {
  return levelsToLevelIngredients(props.levels.levels)
})

const sliderTicks = computed(() => levelIngredientsToSliderTicks(levelIngredients.value))

const range = ref([sliderTicks.value[0], sliderTicks.value.slice(-1)[0]])
const setInitialRangeBasedOnBookmarks = async () => {
  if (import.meta.server) {
    return
  }

  const bookmarks = await db.bookmarks.getByPurpose(
    props.characterId,
    props.variant,
    props.lightConeId,
    "ascension",
  )

  if (bookmarks.length !== 0) {
    const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)
    const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)

    range.value = [sliderTicks.value[sliderTicks.value.indexOf(min) - 1], max]
  } else {
    const characterId = toCharacterIdWithVariant(props.characterId, props.variant)
    const sliderLowerRange = config.characterLevels[characterId]?.ascension ?? sliderTicks.value[0]
    range.value = [sliderLowerRange, sliderTicks.value.slice(-1)[0]]
  }
}
watch([toRefs(props).characterId, toRefs(props).variant], () => {
  void setInitialRangeBasedOnBookmarks()
}, { immediate: true })

const ingredientsWithinSelectedLevelRange = computed<LevelIngredients[]>(() => {
  return levelIngredients.value.filter(e => range.value[0] < e.level && e.level <= range.value[1])
})

const ingredientsToBookmarkableIngredients = (ingredients: LevelIngredients[]): BookmarkableIngredient[] => {
  return ingredients.map(e => e.ingredients.map<BookmarkableIngredient>((f) => {
    let usage: Usage
    if (f.exp) {
      usage = {
        type: "exp",
        lightConeId: props.lightConeId ?? null,
        purposeType: "ascension",
        upperLevel: e.level,
      }
    } else if (props.lightConeId) {
      usage = {
        type: "light_cone",
        lightConeId: props.lightConeId,
        purposeType: "ascension",
        upperLevel: e.level,
      }
    } else {
      usage = {
        type: "character",
        purposeType: "ascension",
        upperLevel: e.level,
      }
    }

    if (usage.type === "exp") {
      const result: BookmarkableExp = {
        type: props.lightConeId ? "light_cone_exp" : "character_exp",
        characterId: toCharacterIdWithVariant(props.characterId, props.variant),
        exp: f.exp!,
        usage,
      }
      return result
    } else {
      if (!f.quantity) {
        throw new Error("Invalid ingredient markup")
      }

      let result: BookmarkableMaterial
      if (usage.type === "character") {
        result = {
          type: "character_material",
          characterId: toCharacterIdWithVariant(props.characterId, props.variant),
          materialId: getMaterialIdFromIngredient(f, props.materialDefs),
          quantity: f.quantity,
          usage,
        }
      } else {
        result = {
          type: "light_cone_material",
          characterId: toCharacterIdWithVariant(props.characterId, props.variant),
          materialId: getMaterialIdFromIngredient(f, props.materialDefs),
          quantity: f.quantity,
          usage,
        }
      }

      return result
    }
  })).flat()
}

const items = computed<BookmarkableIngredient[]>(() => {
  return ingredientsToBookmarkableIngredients(ingredientsWithinSelectedLevelRange.value)
})
</script>
