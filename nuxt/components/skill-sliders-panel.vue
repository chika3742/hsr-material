<script lang="ts" setup>
import {computed, getMaterialIdFromIngredient, levelIngredientsListToSliderTicks, ref} from "#imports"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {LevelIngredients} from "~/types/generated/character-ingredients.g"
import {BookmarkableIngredient} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"
import {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"

const props = defineProps<{
  title: string
  characterId: string
  variantPath?: Path
  materialDefs: CharacterMaterialDefinitions
}>()

const skillI18nKeyBase = computed(() => `skillTitles.${props.characterId + (props.variantPath ? `.${props.variantPath}` : "")}`)

const sliders: { type: Exclude<PurposeType, "exp">, levelIngredientsList: LevelIngredients[] }[] = [
  {
    type: "basicAttack",
    levelIngredientsList: characterIngredients.basicAttack,
  },
  {
    type: "skill",
    levelIngredientsList: characterIngredients.skill,
  },
  {
    type: "ultimate",
    levelIngredientsList: characterIngredients.ultimate,
  },
  {
    type: "talent",
    levelIngredientsList: characterIngredients.talent,
  },
]

const ranges = ref(sliders.map((e) => {
  const sliderTicks = levelIngredientsListToSliderTicks(e.levelIngredientsList)
  return [sliderTicks[0], sliderTicks.slice(-1)[0]]
}))

const checkedList = ref(sliders.map(() => true))

const ingredients = computed<BookmarkableIngredient[]>(() => {
  return sliders.map((e, i) => {
    if (!checkedList.value[i]) {
      return []
    }
    return e.levelIngredientsList.filter(f => ranges.value[i][0] < f.level && f.level <= ranges.value[i][1])
      .map(f => f.ingredients.map<BookmarkableIngredient>(g => ({
        id: getMaterialIdFromIngredient(g, props.materialDefs)!,
        quantity: g.quantity!,
        level: f.level,
        targetType: "character",
        targetId: props.characterId,
        purposeType: e.type,
      }))).flat()
  }).flat()
})

</script>

<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <div class="d-flex flex-column sliders-container" style="gap: 8px">
        <section v-for="(item, i) in sliders" :key="i">
          <v-row align="center" no-gutters>
            <v-checkbox-btn v-model="checkedList[i]" class="flex-grow-0" />
            <h4 :class="{thin: !checkedList[i]}" style="transition: opacity 100ms ease">
              <span class="label-subtitle">{{ tx(`common.skillTypes.${item.type}`) }}</span>
              <span class="ml-2 text-primary">{{ tx(`${skillI18nKeyBase}.${item.type}`) }}</span>
            </h4>
          </v-row>
          <LevelSlider
            v-model="ranges[i]"
            :class="{thin: !checkedList[i]}"
            :slider-ticks="levelIngredientsListToSliderTicks(item.levelIngredientsList)"
            style="transition: opacity 100ms ease"
          />
          <v-divider />
        </section>

        <MaterialCards :items="ingredients" />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style lang="sass" scoped>
.sliders-container
  h4 .label-subtitle
    color: rgb(var(--v-theme-surface-variant))

.thin
  opacity: 0.7
</style>
