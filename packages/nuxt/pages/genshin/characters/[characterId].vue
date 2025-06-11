<script setup lang="ts">
import { omit } from "lodash-es"
import { useTheme } from "vuetify"
import gCharacterIngredients from "~/assets/data/genshin/character-ingredients.yaml"
import gCharacters from "~/assets/data/genshin/characters.yaml"
import type { CharacterAttribute } from "~/components/character/CharacterInfoBox.vue"
import { isCharacterGroup, type CharacterVariantId, type GenshinCharacterSpecs } from "~/types/data/src/characters"

const route = useRoute()
const i18n = useI18n()
const theme = useTheme()

const character = gCharacters.find(e => e.id === route.params.characterId)
if (character === undefined) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const variants = isCharacterGroup(character)
  ? character.variants.map(e => ({
      title: tx(i18n, `elements.${e.element}`),
      value: e.element,
    }))
  : null

const currentVariantId = ref<CharacterVariantId | null>(isCharacterGroup(character) ? character.variants[0]!.variantId : null)

const currentVariant = computed<GenshinCharacterSpecs>(() => {
  if (!isCharacterGroup(character)) {
    return omit(character, ["id", "rarity", "yomi"])
  } else {
    return omit(character.variants.find(e => e.variantId === currentVariantId.value)!, ["variantId"])
  }
})

usePageTitle(computed(() => tx(
  i18n,
  "pageTitles.characterDetails",
  { name: localize(currentVariant.value.name) },
)))

const attrs = computed<CharacterAttribute[]>(() => [
  {
    title: tx(i18n, "common.element"),
    contentImageUrl: getElementImage(currentVariant.value.element),
    invertContentImage: !theme.current.value.dark,
    content: tx(i18n, `elements.${currentVariant.value.element}`),
  },
  {
    title: tx(i18n, "common.weaponType"),
    content: tx(i18n, `weaponTypes.${currentVariant.value.weaponType}`),
  },
])

const ingredientsTable = gCharacterIngredients.ingredientsTables.main

// ascension
const ascensionLevels = levelsToLevelIngredients(ingredientsTable.purposeTypes.ascension!.levels)

const ascensionSliderTicks = computed(() =>
  levelIngredientsToSliderTicks(ascensionLevels),
)

const ascensionRange = ref<[number, number]>([
  ascensionSliderTicks.value[0],
  ascensionSliderTicks.value.slice(-1)[0],
])

const ascensionMaterials = computed(() => {
  const [minLevel, maxLevel] = ascensionRange.value
  const filteredLevels = clampLevelIngredients(ascensionLevels, minLevel, maxLevel)
  return ingredientsToBookmarkableIngredients({
    levelIngredients: filteredLevels,
    characterId: character.id,
    materialDefs: currentVariant.value.materials,
    purposeType: "ascension",
  })
})
</script>

<template>
  <div>
    <CharacterInfoBox
      :image-url="getGenshinCharacterImage(toCharacterIdWithVariant(character.id, currentVariantId), 'small')"
      :attributes="attrs"
    >
      <template #rarity>
        <RarityStars :count="character.rarity" />
      </template>
    </CharacterInfoBox>

    <!-- variant select -->
    <v-select
      v-if="variants"
      v-model="currentVariantId"
      :items="variants"
      :label="tx('common.element')"
      hide-details
      max-width="200px"
      class="mt-4"
    />

    <v-expansion-panels
      class="mt-4"
      mandatory="force"
    >
      <SliderPanelSingle
        v-model="ascensionRange"
        :title="tx('characterDetailsPage.ascensionGenshin')"
        :slider-ticks="ascensionSliderTicks"
        :materials="ascensionMaterials"
      />
    </v-expansion-panels>
  </div>
</template>
