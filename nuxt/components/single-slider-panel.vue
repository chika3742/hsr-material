<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <LevelSlider v-model="range" :slider-ticks="sliderTicks" />
      <MaterialCards
        :items="items"
        :range="range"
        :purpose-types="['ascension']"
        class="mt-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import {BookmarkableExp, BookmarkableIngredient, BookmarkableItem} from "~/types/bookmarkable-ingredient"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"
import {LightConeMaterialDefinitions} from "~/types/generated/light-cones.g"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"
import characters from "~/assets/data/characters.yaml"
import lightCones from "~/assets/data/light-cones.yaml"
import {LevelIngredients} from "~/types/level-ingredients"
import {Usage} from "~/types/bookmark/usage"
import {db} from "~/libs/db/providers"

const props = defineProps<{
  title: string
  characterId: string
  lightConeId?: string
  variant: Path | null
  materialDefs: CharacterMaterialDefinitions | LightConeMaterialDefinitions
}>()

const rarity = (() => {
  if (props.lightConeId) {
    return lightCones.find(e => e.id === props.lightConeId)!.rarity
  } else {
    return characters.find(e => e.id === props.characterId)!.rarity
  }
})()

const levelIngredients = (() => {
  if (props.lightConeId) {
    return levelsToLevelIngredients(lightConeIngredients.levels)
  } else {
    return levelsToLevelIngredients(characterIngredients.purposeTypes.ascension.levels)
  }
})()

const sliderTicks = computed(() => levelIngredientsToSliderTicks(levelIngredients))

const range = ref([sliderTicks.value[0], sliderTicks.value.slice(-1)[0]])
const setInitialRangeBasedOnBookmarks = async() => {
  const bookmarks = await db.bookmarks.getByPurpose(
    props.characterId,
    props.variant,
    props.lightConeId,
    "ascension",
  )

  if (bookmarks.length === 0) {
    return
  }

  const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)
  const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)

  range.value = [sliderTicks.value[sliderTicks.value.indexOf(min) - 1], max]
}
onMounted(() => {
  setInitialRangeBasedOnBookmarks()
})

const ingredientsWithinSelectedLevelRange = computed<LevelIngredients[]>(() => {
  return levelIngredients.filter(e => range.value[0] < e.level && e.level <= range.value[1])
})

const ingredientsToBookmarkableIngredients = (ingredients: LevelIngredients[]): BookmarkableIngredient[] => {
  return ingredients.map(e => e.ingredients.map<BookmarkableIngredient>((f) => {
    let usage: Usage
    if (f.exp) {
      usage = {
        type: "exp",
        characterId: props.characterId,
        variant: props.variant,
        lightConeId: props.lightConeId ?? null,
        purposeType: "ascension",
        upperLevel: e.level,
      }
    } else if (props.lightConeId) {
      usage = {
        type: "light_cone",
        characterId: props.characterId,
        variant: props.variant,
        lightConeId: props.lightConeId,
        purposeType: "ascension",
        upperLevel: e.level,
      }
    } else {
      usage = {
        type: "character",
        characterId: props.characterId,
        variant: props.variant,
        purposeType: "ascension",
        upperLevel: e.level,
      }
    }

    if (usage.type === "exp") {
      const result: BookmarkableExp = {
        type: props.lightConeId ? "light_cone_exp" : "character_exp",
        exp: f.exp!.rarities[rarity.toString()],
        usage,
      }
      return result
    } else {
      if (!f.quantity) {
        throw new Error("Invalid ingredient markup")
      }

      let result: BookmarkableItem
      if (usage.type === "character") {
        result = {
          type: "character_material",
          materialId: getMaterialIdFromIngredient(f, props.materialDefs),
          quantity: f.quantity.rarities[rarity.toString()],
          usage,
        }
      } else {
        result = {
          type: "light_cone_material",
          materialId: getMaterialIdFromIngredient(f, props.materialDefs),
          quantity: f.quantity.rarities[rarity.toString()],
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
