<script lang="ts" setup>
import {computed, getMaterialIdFromIngredient, levelIngredientsToSliderTicks, ref} from "#imports"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {BookmarkableIngredient} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"
import {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"
import {LevelIngredients} from "~/types/level-ingredients"
import characters from "~/assets/data/characters.yaml"

interface Slider {
  type: Exclude<PurposeType, "exp">
  levelIngredients: LevelIngredients[]
}

const props = defineProps<{
  title: string
  characterId: string
  variantPath?: Path
  materialDefs: CharacterMaterialDefinitions
}>()

const skillI18nKeyBase = computed(() => `skillTitles.${props.characterId + (props.variantPath ? `.${props.variantPath}` : "")}`)

const sliders: Slider[] = [
  {
    type: "basicAttack",
    levelIngredients: levelsToLevelIngredients(characterIngredients.purposeTypes.basicAttack.levels),
  },
  {
    type: "skill",
    levelIngredients: levelsToLevelIngredients(characterIngredients.purposeTypes.skill.levels),
  },
  {
    type: "ultimate",
    levelIngredients: levelsToLevelIngredients(characterIngredients.purposeTypes.ultimate.levels),
  },
  {
    type: "talent",
    levelIngredients: levelsToLevelIngredients(characterIngredients.purposeTypes.talent.levels),
  },
]

const characterRarity = characters.find(e => e.id === props.characterId)!.rarity

const ranges = ref(sliders.map((e) => {
  const sliderTicks = levelIngredientsToSliderTicks(e.levelIngredients)
  return [sliderTicks[0], sliderTicks.slice(-1)[0]]
}))

const checkedList = ref(sliders.map(() => true))

const ingredients = computed<BookmarkableIngredient[]>(() => {
  return sliders.map((e, i) => {
    if (!checkedList.value[i]) {
      return []
    }
    return e.levelIngredients.filter(f => ranges.value[i][0] < f.level && f.level <= ranges.value[i][1])
      .map(f => f.ingredients.map<BookmarkableIngredient>(g => ({
        id: getMaterialIdFromIngredient(g, props.materialDefs)!,
        quantity: g.quantity!.rarities[characterRarity.toString()],
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
            <h4>
              <span class="label-subtitle">{{ tx(`common.skillTypes.${item.type}`) }}</span>
              <span class="ml-2 text-primary">{{ tx(`${skillI18nKeyBase}.${item.type}`) }}</span>
            </h4>
          </v-row>
          <v-expand-transition>
            <LevelSlider
              v-show="checkedList[i]"
              v-model="ranges[i]"
              :slider-ticks="levelIngredientsToSliderTicks(item.levelIngredients)"
            />
          </v-expand-transition>
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
</style>
