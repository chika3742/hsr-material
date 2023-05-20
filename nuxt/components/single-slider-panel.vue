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
import {LevelIngredients} from "~/types/generated/character-ingredients.g"
import {
  BookmarkableExp,
  BookmarkableIngredient,
  BookmarkableIngredientMeta,
  BookmarkableItem,
} from "~/types/bookmarkable-ingredient"
import {TargetType} from "~/types/strings"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {CharacterMaterialDefinitions} from "~/types/generated/characters.g"

const props = defineProps<{
  title: string
  targetType: TargetType
  targetId: string
  materialDefs: CharacterMaterialDefinitions
  rarity?: number
}>()

const levelIngredientsList = computed<LevelIngredients[]>(() => {
  switch (props.targetType) {
    case "character":
      return characterIngredients.ascension
      // case "weapon":
      //   return weaponIngredients.find(e => e.rarity === props.rarity)!.levels
  }
})

const sliderTicks = computed(() => levelIngredientsListToSliderTicks(levelIngredientsList.value))

const range = ref([sliderTicks.value[0], sliderTicks.value.slice(-1)[0]])

const selectedLevelIngredientsList = computed<LevelIngredients[]>(() => {
  return levelIngredientsList.value.filter(e => range.value[0] < e.level && e.level <= range.value[1])
})

const items = computed<BookmarkableItem[]>(() => {
  return selectedLevelIngredientsList.value.map(e => e.ingredients.map<BookmarkableItem>((f) => {
    const meta: BookmarkableIngredientMeta = {
      level: e.level,
      targetType: props.targetType,
      targetId: props.targetId,
    }

    if (typeof f.quantity !== "undefined") {
      const result: BookmarkableIngredient = {
        id: getMaterialIdFromIngredient(f, props.materialDefs),
        quantity: f.quantity,
        ...meta,
        purposeType: "ascension",
      }
      return result
    } else {
      const result: BookmarkableExp = {
        exp: f.exp!,
        ...meta,
        purposeType: "exp",
      }
      return result
    }
  })).flat()
})
</script>
