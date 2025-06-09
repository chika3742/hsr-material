<script lang="ts" setup>
import lightCones from "~/assets/data/light-cones.yaml"
import EmphasizedText from "~/components/emphasized-text.vue"
import hCharacters from "~/assets/data/characters.yaml"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"
import type { CharacterIdWithVariant, VariantlessHsrCharacter } from "~/types/data/src/characters"
import { levelIngredientsToSliderTicks } from "~/utils/level-ingredients-to-slider-ticks"
import { ingredientsToBookmarkableIngredients } from "~/utils/ingredients-to-bookmarkable-ingredients"

const route = useRoute()

if (!lightCones.some(e => e.id === route.params.lightConeId)) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const lightCone = lightCones.find(e => e.id === route.params.lightConeId)!
usePageTitle(tx("pageTitles.lightConeDetails", { name: localize(lightCone.name) }))

const selectedCharacter = ref<CharacterIdWithVariant>()

const characterSelectFilter = (id: string): boolean => {
  const variant = toVariant(id)
  if (variant !== null) {
    return variant === lightCone.path
  } else {
    return (hCharacters.find(e => e.id === id) as VariantlessHsrCharacter).path === lightCone.path
  }
}

const purposeTypes = computed(() => {
  const tableId = (() => {
    switch (lightCone.rarity) {
      case 3:
        return "r3Base"
      case 4:
        return "r4Base"
      case 5:
        return "r5Base"
      default:
        throw new Error("Invalid rarity")
    }
  })()

  return lightConeIngredients.ingredientsTables[tableId].purposeTypes
})

const levels = purposeTypes.value.ascension?.levels
if (!levels) {
  throw new Error("Ascension levels not found")
}
const ascensionLevels = levelsToLevelIngredients(levels)

const ascensionSliderTicks = computed(() =>
  levelIngredientsToSliderTicks(ascensionLevels),
)

const ascensionRange = ref<[number, number]>([
  ascensionSliderTicks.value[0],
  ascensionSliderTicks.value.slice(-1)[0],
])

const ascensionMaterials = computed(() => {
  if (!selectedCharacter.value) {
    return []
  }
  const [minLevel, maxLevel] = ascensionRange.value
  const filteredLevels = clampLevelIngredients(ascensionLevels, minLevel, maxLevel)
  return ingredientsToBookmarkableIngredients({
    levelIngredients: filteredLevels,
    characterId: selectedCharacter.value,
    lightConeId: lightCone.id,
    purposeType: "ascension",
    materialDefs: lightCone.materials,
  })
})
</script>

<template>
  <div>
    <v-row
      align="center"
      no-gutters
    >
      <v-img
        :src="getLightConeImage(lightCone.id)"
        max-width="60px"
        width="60px"
      />
      <div
        class="ml-4 d-flex flex-column"
        style="gap: 4px"
      >
        <div>
          <v-icon
            v-for="i of lightCone.rarity"
            :key="i"
            color="star"
            size="18"
          >
            mdi-star
          </v-icon>
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-bold">{{ tx("common.path") }}</span>
          <v-img
            :src="getPathImage(lightCone.path)"
            :style="!$vuetify.theme.global.current.dark ? 'filter: invert(1)' : ''"
            aspect-ratio="1"
            class="ml-3"
            max-width="22px"
            width="22px"
          />
          <span class="ml-1">{{ tx(`paths.${lightCone.path}` as const) }}</span>
        </div>
      </div>
    </v-row>

    <section class="mt-2">
      <h4 class="c-subheader">
        {{ tx('lightConeDetailsPage.skillDescriptions') }}
      </h4>
      <EmphasizedText
        :text="localize(lightCone.skillDescription)"
        class="pl-4 mt-1"
      />
    </section>

    <CharacterSelect
      v-model="selectedCharacter"
      :characters="$characterSelectItems"
      :label="tx('relicDetailsPage.characterToEquip')"
      class="mt-4"
      :filter="characterSelectFilter"
      :filter-disable-checkbox-text="tx('common.showAllCharacters')"
      max-width="300px"
    />

    <v-expansion-panels
      class="mt-4"
      mandatory="force"
    >
      <SliderPanelSingle
        v-model="ascensionRange"
        :title="tx('lightConeDetailsPage.ascension')"
        :slider-ticks="ascensionSliderTicks"
        :materials="ascensionMaterials"
      />
    </v-expansion-panels>
  </div>
</template>

<style lang="sass">
.hmn-desc-emphasis
  color: rgb(var(--v-theme-secondary))
  font-weight: bold
</style>
