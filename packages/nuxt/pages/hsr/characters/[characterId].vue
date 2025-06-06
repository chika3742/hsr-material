<script setup lang="ts">
import { omit } from "lodash-es"
import { useTheme } from "vuetify"
import hCharacters from "~/assets/data/characters.yaml"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import type { LevelsForPurposeTypes } from "~/types/level-ingredients"
import { type CharacterVariantId, type HsrCharacterSpecs, isCharacterGroup } from "~/types/data/src/characters"
import type { SliderSkill } from "~/components/skill-sliders-panel.vue"
import type { PurposeType } from "~/types/strings"
import type { CharacterAttribute } from "~/components/character/CharacterInfoBox.vue"

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

const purposeTypes = computed<LevelsForPurposeTypes>(() => {
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

  return characterIngredients.ingredientsTables[currentVariant.value.ingredientsTable ?? getDefaultLitForRarity()].purposeTypes
})

const skills = computed<SliderSkill[]>(() => {
  return Object.entries(currentVariant.value.skills).map(([k, v]) => ({
    purposeType: k as PurposeType,
    title: localize(v.name, i18n),
    ingredients: purposeTypes.value[k as PurposeType]!,
  }))
})

const attrs = computed<CharacterAttribute[]>(() => [
  {
    title: tx("common.path"),
    contentImageUrl: getPathImage(currentVariant.value.path),
    invertContentImage: !theme.current.value.dark,
    content: tx(`paths.${currentVariant.value.path}`),
  },
  {
    title: tx("common.combatType"),
    contentImageUrl: getCombatTypeImage(currentVariant.value.combatType),
    content: tx(`combatTypes.${currentVariant.value.combatType}`),
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
      <SingleSliderPanel
        :material-defs="currentVariant.materials"
        :character-id="character.id"
        :levels="purposeTypes.ascension!"
        :title="tx('characterDetailsPage.ascension')"
      />
      <SkillSlidersPanel
        :character-id="character.id"
        :material-defs="currentVariant.materials"
        :title="tx('characterDetailsPage.skills')"
        :variant="currentVariantId"
        :skills="skills"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="sass">

</style>
