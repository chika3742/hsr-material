<script lang="ts" setup>
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import {PurposeType} from "~/types/strings"
import {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"
import {LevelIngredients} from "~/types/level-ingredients"
import characters from "~/assets/data/characters.yaml"
import {db} from "~/libs/db/providers"
import {BookmarkableMaterial} from "~/types/bookmark/bookmarkables"

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

const config = useConfigStore()

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
  const checkedListTmp = sliders.map(() => false)

  for (let index = 0; index < sliders.length; index++) {
    const slider = sliders[index]

    const bookmarks = await db.bookmarks.getByPurpose(
      props.characterId,
      props.variant,
      undefined,
      slider.type,
    )

    const sliderTicks = levelIngredientsToSliderTicks(slider.levelIngredients)

    if (bookmarks.length !== 0) {
      checkedListTmp[index] = true

      const min = bookmarks.reduce((a, b) => Math.min(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)
      const max = bookmarks.reduce((a, b) => Math.max(a, b.usage.upperLevel), bookmarks[0].usage.upperLevel)

      ranges.value[index] = [sliderTicks[sliderTicks.indexOf(min) - 1], max]
    } else {
      // restore minimum value from persist store (game data sync)
      const characterId = toCharacterIdWithVariant(props.characterId, props.variant)
      ranges.value[index] =
        [config.characterLevels[characterId]?.[slider.type] ?? sliderTicks[0], sliderTicks.slice(-1)[0]]
    }
  }

  if (checkedListTmp.every(e => !e)) {
    checkedList.value = sliders.map(() => true)
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
      <div class="d-flex flex-column sliders-container mx-n4 mx-sm-0">
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
          <v-divider class="my-2" />
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
