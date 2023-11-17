<script lang="ts" setup>
import {computed, getMaterialIdFromIngredient, levelIngredientsToSliderTicks, ref} from "#imports"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import type {PurposeType} from "~/types/strings"
import type {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"
import type {LevelIngredients} from "~/types/level-ingredients"
import characters from "~/assets/data/characters.yaml"
import {db} from "~/libs/db/providers"
import type {BookmarkableMaterial} from "~/types/bookmark/bookmarkables"

interface Slider {
  type: PurposeType
  levelIngredients: LevelIngredients[]
}

const props = defineProps<{
  title: string
  characterId: string
  variant: Path | null
  materialDefs: CharacterMaterialDefinitions
}>()

const skillI18nKeyBase = computed(() => `skillTitles.${props.characterId + (props.variant ? `.${props.variant}` : "")}`)

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
const setInitialRangeBasedOnBookmarks = async() => {
  for (let index = 0; index < sliders.length; index++) {
    const slider = sliders[index]

    const bookmarks = await db.bookmarks.getByPurpose(
      props.characterId,
      props.variant,
      undefined,
      slider.type,
    )

    if (bookmarks.length === 0) {
      checkedList.value[index] = false
      continue
    }

    const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)
    const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)

    const sliderTicks = levelIngredientsToSliderTicks(slider.levelIngredients)

    ranges.value[index] = [sliderTicks[sliderTicks.indexOf(min) - 1], max]
  }

  if (checkedList.value.every(e => !e)) {
    checkedList.value = sliders.map(() => true)
  }
}
onMounted(() => {
  void setInitialRangeBasedOnBookmarks()
})

const ingredients = computed<BookmarkableMaterial[]>(() => {
  return sliders.map((e, i) => {
    if (!checkedList.value[i]) {
      return []
    }
    return e.levelIngredients.filter(f => ranges.value[i][0] < f.level && f.level <= ranges.value[i][1])
      .map(f => f.ingredients.map<BookmarkableMaterial>(g => ({
        type: "character_material",
        characterId: toCharacterIdWithVariant(props.characterId, props.variant),
        materialId: getMaterialIdFromIngredient(g, props.materialDefs)!,
        quantity: g.quantity!.rarities[characterRarity.toString()],
        usage: {
          type: "character",
          upperLevel: f.level,
          purposeType: e.type,
        },
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

        <MaterialItems :items="ingredients" :purpose-types="sliders.map(e => e.type)" />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style lang="sass" scoped>
.sliders-container
  h4 .label-subtitle
    color: rgb(var(--v-theme-surface-variant))
</style>
