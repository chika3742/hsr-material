<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <LevelSlider v-model="range" :slider-ticks="sliderTicks" />
      <MaterialCards
        :items="items"
        :range="range"
        class="mt-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
import {
  BookmarkableExp,
  BookmarkableIngredient,
  BookmarkableIngredientMeta,
  BookmarkableItem,
} from "~/types/bookmarkable-ingredient"
import {TargetType} from "~/types/strings"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {CharacterMaterialDefinitions} from "~/types/generated/characters.g"
import {LightConeMaterialDefinitions} from "~/types/generated/light-cones.g"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"
import characters from "~/assets/data/characters.yaml"
import lightCones from "~/assets/data/light-cones.yaml"
import {LevelIngredients} from "~/types/level-ingredients"

const props = defineProps<{
  title: string
  targetType: TargetType
  targetId: string
  materialDefs: CharacterMaterialDefinitions | LightConeMaterialDefinitions
}>()

const rarity = (() => {
  switch (props.targetType) {
    case "character":
      return characters.find(e => e.id === props.targetId)!.rarity
    case "light_cone":
      return lightCones.find(e => e.id === props.targetId)!.rarity
  }
})()

const levelIngredients = (() => {
  switch (props.targetType) {
    case "character":
      return levelsToLevelIngredients(characterIngredients.purposeTypes.ascension.levels)
    case "light_cone": {
      return levelsToLevelIngredients(lightConeIngredients.levels)
    }
  }
})()

const sliderTicks = computed(() => levelIngredientsToSliderTicks(levelIngredients))

const range = ref([sliderTicks.value[0], sliderTicks.value.slice(-1)[0]])

const ingredientsWithinSelectedLevelRange = computed<LevelIngredients[]>(() => {
  return levelIngredients.filter(e => range.value[0] < e.level && e.level <= range.value[1])
})

const items = computed<BookmarkableItem[]>(() => {
  return ingredientsWithinSelectedLevelRange.value.map(e => e.ingredients.map<BookmarkableItem>((f) => {
    const meta: BookmarkableIngredientMeta = {
      level: e.level,
      targetType: props.targetType,
      targetId: props.targetId,
    }

    if (typeof f.quantity !== "undefined") {
      const result: BookmarkableIngredient = {
        id: getMaterialIdFromIngredient(f, props.materialDefs),
        quantity: f.quantity.rarities[rarity.toString()],
        ...meta,
        purposeType: "ascension",
      }
      return result
    } else {
      const result: BookmarkableExp = {
        exp: f.exp!.rarities[rarity.toString()],
        ...meta,
        purposeType: "exp",
      }
      return result
    }
  })).flat()
})
</script>
