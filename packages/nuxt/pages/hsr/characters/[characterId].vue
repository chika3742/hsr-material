<script setup lang="ts">
import { omit } from "lodash-es"
import { useTheme } from "vuetify"
import hCharacters from "~/assets/data/characters.yaml"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import type { LevelIngredients } from "~/types/level-ingredients"
import { type CharacterVariantId, type HsrCharacterSpecs, isCharacterGroup } from "~/types/data/src/characters"
import type { PurposeType } from "~/types/data/enums"
import type { CharacterAttribute } from "~/components/character/CharacterInfoBox.vue"
import { ingredientsToBookmarkableIngredients } from "~/utils/ingredients-to-bookmarkable-ingredients"
import type { BookmarkableIngredient } from "~/types/bookmark/bookmarkables"
import { levelsToLevelIngredients } from "~/utils/levels-to-level-ingredients"
import { clampLevelIngredients } from "~/utils/ingredients"
import type { SliderConfig } from "~/components/slider-panel/SliderPanelMultiple.vue"
import type { IngredientsTable } from "~/types/data/src/ingredients"

interface SkillInfo {
  purposeType: PurposeType
  title: string
  ingredients: LevelIngredients[]
}

const route = useRoute()
const router = useRouter()
const config = useConfigStore()
const i18n = useI18n()
const theme = useTheme()

if (!hCharacters.some(e => e.id === route.params.characterId)) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const character = hCharacters.find(e => e.id === route.params.characterId)!

const currentVariant = computed<HsrCharacterSpecs>(() => {
  if (!isCharacterGroup(character)) {
    return omit(character, ["id", "rarity", "yomi"])
  } else {
    return omit(character.variants.find(e => e.variantId === currentVariantId.value)!, ["variantId"])
  }
})

const currentVariantId = ref<CharacterVariantId | null>(isCharacterGroup(character) ? character.variants[0]!.variantId : null)

usePageTitle(computed(() => {
  return tx(
    i18n,
    "pageTitles.characterDetails",
    { name: localize(currentVariant.value.name, i18n) },
  )
}))

const ingredientsTable = computed<IngredientsTable>(() => {
  const getDefaultLitForRarity = () => {
    switch (character.rarity) {
      case 4:
        return "r4Base"
      case 5:
        return "r5Base"
      default:
        throw new Error("Invalid rarity")
    }
  }

  return characterIngredients.ingredientsTables[currentVariant.value.ingredientsTable ?? getDefaultLitForRarity()]
})

// ascension
const ascensionLevels = levelsToLevelIngredients(ingredientsTable.value.purposeTypes.ascension!.levels)

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

const skills = computed<SkillInfo[]>(() => {
  return Object.entries(currentVariant.value.skills).map(([purposeType, skill]) => ({
    purposeType: purposeType as PurposeType,
    title: localize(skill.name, i18n),
    ingredients: levelsToLevelIngredients(
      ingredientsTable.value.purposeTypes[purposeType as PurposeType]!.levels,
    ),
  }))
})

const skillSliderConfigs = computed<SliderConfig[]>(() => {
  return skills.value.map((skill) => {
    return {
      key: skill.purposeType,
      title: skill.title,
      sliderTicks: levelIngredientsToSliderTicks(skill.ingredients),
      purposeType: skill.purposeType,
    }
  })
})

const skillRanges = ref<Record<string, [number, number]>>({})
const enabledSkills = ref<string[]>([])

watchEffect(() => {
  skillRanges.value = Object.fromEntries(skillSliderConfigs.value.map(config => [
    config.key,
    [config.sliderTicks[0], config.sliderTicks.slice(-1)[0]],
  ]))
  enabledSkills.value = skills.value.map(s => s.purposeType)
})

const attrs = computed<CharacterAttribute[]>(() => [
  {
    title: tx(i18n, "common.path"),
    contentImageUrl: getPathImage(currentVariant.value.path),
    invertContentImage: !theme.current.value.dark,
    content: tx(i18n, `paths.${currentVariant.value.path}`),
  },
  {
    title: tx(i18n, "common.combatType"),
    contentImageUrl: getCombatTypeImage(currentVariant.value.combatType),
    content: tx(i18n, `combatTypes.${currentVariant.value.combatType}`),
  },
])

watch(currentVariant, (value) => {
  void router.replace({ query: { variant: value.path } })
})

onActivated(() => {
  if (isCharacterGroup(character) && route.query.variant) {
    currentVariantId.value = character.variants.find(e => e.path === route.query.variant)?.variantId
      ?? currentVariantId.value
  }
})

const skillMaterials = computed<BookmarkableIngredient[]>(() => {
  const materials: BookmarkableIngredient[] = []

  for (const skill of skills.value) {
    if (!enabledSkills.value.includes(skill.purposeType)) continue
    const range = skillRanges.value[skill.purposeType]
    if (!range) continue
    const [minLevel, maxLevel] = range
    const filteredLevels = clampLevelIngredients(
      skill.ingredients,
      minLevel,
      maxLevel,
    )
    materials.push(...ingredientsToBookmarkableIngredients({
      levelIngredients: filteredLevels,
      characterId: character.id,
      materialDefs: currentVariant.value.materials,
      purposeType: skill.purposeType,
    }))
  }
  return materials
})
</script>

<template>
  <div>
    <v-row
      align="center"
      class="ga-4"
      no-gutters
    >
      <CharacterInfoBox
        :image-url="getHsrCharacterImage(toCharacterIdWithVariant(character.id, currentVariantId), 'small')"
        :attributes="attrs"
      >
        <template #rarity>
          <RarityStars :count="character.rarity" />
        </template>
      </CharacterInfoBox>

      <!-- Is owned checkbox -->
      <v-checkbox
        v-if="character.id !== 'trailblazer'"
        v-model="config.ownedCharacters"
        :label="tx('characterDetailsPage.iHave')"
        :value="character.id"
        class="flex-0-0"
        hide-details
      />

      <div class="d-flex flex-column ga-2">
        <v-btn
          :text="tx('characterDetailsPage.bookmarkLightCone')"
          color="primary"
          prepend-icon="mdi-cone"
          variant="outlined"
          :to="$localePath({
            path: '/hsr/light-cones',
            query: { character: toCharacterIdWithVariant(character.id, currentVariantId) },
          })"
        />

        <v-btn
          :text="tx('characterDetailsPage.bookmarkRelics')"
          color="primary"
          prepend-icon="mdi-star-david"
          variant="outlined"
          :to="$localePath({
            path: '/hsr/relics',
            query: { character: toCharacterIdWithVariant(character.id, currentVariantId) },
          })"
        />
      </div>
    </v-row>

    <client-only>
      <v-select
        v-if="isCharacterGroup(character)"
        v-model="currentVariantId"
        :items="character.variants.map(e => ({ title: tx(`paths.${e.path}`), value: e.variantId }))"
        :label="tx('common.path')"
        class="mt-4"
        hide-details
        style="max-width: 200px"
      />
    </client-only>

    <v-expansion-panels
      class="mt-4"
      mandatory="force"
    >
      <SliderPanelSingle
        v-model="ascensionRange"
        :title="tx('characterDetailsPage.ascension')"
        :slider-ticks="ascensionSliderTicks"
        :materials="ascensionMaterials"
      />
      <SliderPanelMultiple
        v-model="skillRanges"
        v-model:enabled-skills="enabledSkills"
        :title="tx('characterDetailsPage.skills')"
        :slider-configs="skillSliderConfigs"
        :materials="skillMaterials"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="sass">

</style>
