<script lang="ts" setup>
import type { PurposeType } from "~/types/strings"
import type { LevelIngredients } from "~/types/level-ingredients"
import { db } from "~/libs/db/providers"
import type { BookmarkableMaterial } from "~/types/bookmark/bookmarkables"
import { isExpIngredient, type EachLevels, type Ingredient, type MaterialExpr } from "~/types/data/ingredient"
import type { CharacterVariantId } from "~/types/data/src/characters"

interface Slider {
  type: PurposeType
  title: string
  levelIngredients: LevelIngredients[]
}

const props = defineProps<{
  title: string
  characterId: string
  variant: CharacterVariantId | null
  materialDefs: Record<string, MaterialExpr>
  skills: SliderSkill[]
}>()

const config = useConfigStore()

const sliders = computed<Slider[]>(() => props.skills.map(e => ({
  type: e.purposeType,
  title: e.title,
  levelIngredients: levelsToLevelIngredients(e.ingredients.levels),
})))

const ranges = ref<number[][]>(sliders.value.map((e) => {
  const sliderTicks = levelIngredientsToSliderTicks(e.levelIngredients)
  return [sliderTicks[0] ?? 0, sliderTicks.slice(-1)[0] ?? 0]
}))
const checkedList = ref(sliders.value.map(() => true))
const setInitialRangeBasedOnBookmarks = async () => {
  // reinit ranges without considering bookmarks
  ranges.value = sliders.value.map((e) => {
    const sliderTicks = levelIngredientsToSliderTicks(e.levelIngredients)
    return [sliderTicks[0] ?? 0, sliderTicks.slice(-1)[0] ?? 0]
  })

  const checkedListTmp = sliders.value.map(() => false)

  for (let index = 0; index < sliders.value.length; index++) {
    const slider = sliders.value[index]
    if (!slider) continue

    const bookmarks = await db.bookmarks.getByPurpose(
      props.characterId,
      props.variant,
      undefined,
      slider.type,
    )

    const sliderTicks = levelIngredientsToSliderTicks(slider.levelIngredients)

    if (bookmarks.length !== 0) {
      checkedListTmp[index] = true

      const base = bookmarks[0]!
      const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), base.usage.upperLevel)
      const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), base.usage.upperLevel)

      ranges.value[index] = [sliderTicks[sliderTicks.indexOf(min) - 1] ?? 0, max]
    } else {
      // restore minimum value from persist store (game data sync)
      const characterId = toCharacterIdWithVariant(props.characterId, props.variant)
      ranges.value[index]
        = [config.characterLevels[characterId]?.[slider.type] ?? (sliderTicks[0] ?? 0), sliderTicks.slice(-1)[0] ?? 0]
    }
  }

  if (checkedListTmp.every(e => !e)) {
    checkedList.value = sliders.value.map(() => true)
  } else {
    checkedList.value = checkedListTmp
  }
}
onMounted(() => {
  void setInitialRangeBasedOnBookmarks()
})
watch(toRefs(props).variant, () => {
  void setInitialRangeBasedOnBookmarks()
})

const ingredients = computed<BookmarkableMaterial[]>(() => {
  return sliders.value.map((e, i) => {
    if (!checkedList.value[i]) {
      return []
    }
    const currentRange = ranges.value[i]
    if (!currentRange) {
      return []
    }
    const filtered = e.levelIngredients.filter(f => (currentRange[0] ?? 0) < f.level && f.level <= (currentRange[1] ?? 0))
    const characterIdWithVariant = toCharacterIdWithVariant(props.characterId, props.variant)
    const result: BookmarkableMaterial[] = []

    for (const lv of filtered) {
      for (const item of lv.ingredients) {
        if (isExpIngredient(item)) {
          throw new Error("Exp ingredients are not supported.")
        }

        const materialId = getMaterialIdFromIngredient(item, props.materialDefs, characterIdWithVariant)
        if (materialId === null) {
          continue // qty is zero
        }

        result.push({
          type: "character_material",
          characterId: characterIdWithVariant,
          materialId,
          quantity: item.quantity!,
          usage: {
            type: "character",
            upperLevel: lv.level,
            purposeType: e.type,
          },
        })
      }
    }

    return result
  }).flat()
})
</script>

<script lang="ts">
export interface SliderSkill {
  purposeType: PurposeType
  title: string
  ingredients: EachLevels<Ingredient[]>
}
</script>

<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <div class="d-flex flex-column sliders-container mx-n4 mx-sm-0">
        <section
          v-for="(item, i) in sliders"
          :key="i"
        >
          <v-row
            align="center"
            no-gutters
          >
            <v-checkbox-btn
              v-model="checkedList[i]"
              class="flex-grow-0"
            />
            <h4>
              <span class="label-subtitle">{{ tx(`common.skillTypes.${item.type}`) }}</span>
              <span class="ml-2 text-primary">{{ item.title }}</span>
            </h4>
          </v-row>
          <v-expand-transition>
            <LevelSlider
              v-if="ranges[i]"
              v-show="checkedList[i]"
              v-model="ranges[i]"
              :slider-ticks="levelIngredientsToSliderTicks(item.levelIngredients)"
            />
          </v-expand-transition>
          <v-divider class="my-2" />
        </section>

        <MaterialItems
          :items="ingredients"
          :purpose-types="sliders.map(e => e.type)"
        />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style lang="sass" scoped>
.sliders-container
  h4 .label-subtitle
    color: rgb(var(--v-theme-surface-variant))
</style>
