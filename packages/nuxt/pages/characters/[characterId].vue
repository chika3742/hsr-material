<script setup lang="ts">
import { omit } from "lodash-es"
import characters from "~/assets/data/characters.yaml"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import type { LevelsForPurposeTypes } from "~/types/level-ingredients"
import { type HsrCharacterVariant, isCharacterGroup } from "~/types/data/src/characters"
import type { SliderSkill } from "~/components/skill-sliders-panel.vue"
import type { PurposeType } from "~/types/strings"

const route = useRoute()
const router = useRouter()
const config = useConfigStore()
const i18n = useI18n()

if (!characters.some(e => e.id === route.params.characterId)) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const character = characters.find(e => e.id === route.params.characterId)!

const currentVariant = ref<HsrCharacterVariant>(isCharacterGroup(character)
  ? character.variants[0]!
  : omit(character, ["id", "rarity", "yomi"]))

const currentVariantId = computed(() => isCharacterGroup(character) ? currentVariant.value.path : null)

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

  return characterIngredients.ingredientsTables[currentVariant.value.levelingItemTable ?? getDefaultLitForRarity()].purposeTypes
})

const purposeTypesOmitted = computed<Omit<LevelsForPurposeTypes, "ascension">>(() => {
  const result = { ...purposeTypes.value } as any
  delete result.ascension
  return result
})

watch(currentVariant, (value) => {
  void router.replace({ query: { variant: value.path } })
})

onActivated(() => {
  if (isCharacterGroup(character) && route.query.variant) {
    currentVariant.value = character.variants.find(e => e.path === route.query.variant) ?? currentVariant.value
  }
})
</script>

<template>
  <div>
    <v-row
      align="center"
      class="g-4"
      no-gutters
    >
      <!-- character image -->
      <v-img
        :src="getCharacterImage(toCharacterIdWithVariant(character.id, currentVariantId), 'small')"
        aspect-ratio="1"
        max-width="80px"
        width="80px"
      />

      <!-- character info -->
      <div
        class="d-flex flex-column"
        style="gap: 4px"
      >
        <div>
          <v-icon
            v-for="i of character.rarity"
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
            :src="getPathImage(currentVariant.path)"
            :style="!$vuetify.theme.global.current.dark ? 'filter: invert(1)' : ''"
            aspect-ratio="1"
            class="ml-3"
            max-width="22px"
            width="22px"
          />
          <span class="ml-1">{{ tx(`paths.${currentVariant.path}` as const) }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-bold">{{ tx("common.combatType") }}</span>
          <v-img
            :src="getCombatTypeImage(currentVariant.combatType)"
            class="ml-3"
            aspect-ratio="1"
            max-width="22px"
            width="22px"
          />
          <span class="ml-1">{{ tx(`combatTypes.${currentVariant.combatType}` as const) }}</span>
        </div>
      </div>

      <!-- Is owned checkbox -->
      <v-checkbox
        v-if="character.id !== 'trailblazer'"
        v-model="config.ownedCharacters"
        :label="tx('characterDetailsPage.iHave')"
        :value="character.id"
        class="flex-0-0"
        hide-details
      />

      <div class="d-flex flex-column g-2">
        <v-btn
          :text="tx('characterDetailsPage.bookmarkLightCone')"
          color="primary"
          prepend-icon="mdi-cone"
          variant="outlined"
          @click="$router.push($localePath({
            path: '/light-cones',
            query: { character: toCharacterIdWithVariant(character.id, currentVariantId) },
          }))"
        />

        <v-btn
          :text="tx('characterDetailsPage.bookmarkRelics')"
          color="primary"
          prepend-icon="mdi-star-david"
          variant="outlined"
          @click="$router.push($localePath({
            path: '/relics',
            query: { character: toCharacterIdWithVariant(character.id, currentVariantId) },
          }))"
        />
      </div>
    </v-row>

    <client-only>
      <v-select
        v-if="isCharacterGroup(character)"
        v-model="currentVariant"
        :items="character.variants.map(e => ({ title: tx(`paths.${e.path}` as const), value: e }))"
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
        :variant="currentVariantId"
        :levels="purposeTypes.ascension!"
        :title="tx('characterDetailsPage.ascension')"
      />
      <SkillSlidersPanel
        :character-id="character.id"
        :material-defs="currentVariant.materials"
        :title="tx('characterDetailsPage.skills')"
        :purpose-types="purposeTypesOmitted"
        :variant="currentVariantId"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="sass">

</style>
