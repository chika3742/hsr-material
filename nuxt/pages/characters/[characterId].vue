<script setup lang="ts">
import characters from "~/assets/data/characters.yaml"
import {CharacterVariant} from "~/types/generated/characters.g"

definePageMeta({
  title: "characterDetails",
  itemI18nKey: "characterNames",
})

const route = useRoute()
const router = useRouter()

if (!characters.some(e => e.id === route.params.characterId)) {
  throw createError({statusCode: 404, message: "Page not found", fatal: true})
}

const character = characters.find(e => e.id === route.params.characterId)!

const selectedVariant = ref<CharacterVariant>(character.variants?.[0] ?? {
  path: character.path!,
  combatType: character.combatType!,
  materials: character.materials!,
})

watch(selectedVariant, (value) => {
  history.replaceState(null, "", router.resolve({query: {variant: value.path}}).href)
})

onActivated(() => {
  if (character.variants && route.query.variant) {
    selectedVariant.value = character.variants.find(e => e.path === route.query.variant) ?? selectedVariant.value
  }
})

</script>

<template>
  <div>
    <v-row align="center" no-gutters>
      <v-img :src="getCharacterImage(character.id, 'small')" max-width="80" />
      <div class="ml-4 d-flex flex-column" style="gap: 4px">
        <div>
          <v-icon v-for="i of character.rarity" :key="i" color="star" size="18">
            mdi-star
          </v-icon>
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-bold">{{ tx("common.path") }}</span>
          <v-img
            :src="getPathImage(selectedVariant.path)"
            :style="!$vuetify.theme.global.current.dark ? 'filter: invert(1)' : ''"
            aspect-ratio="1"
            class="ml-3"
            max-width="22px"
            width="22px"
          />
          <span class="ml-1">{{ tx(`paths.${selectedVariant.path}` as const) }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="font-weight-bold">{{ tx("common.combatType") }}</span>
          <v-img :src="getCombatTypeImage(selectedVariant.combatType)" class="ml-3" max-width="22px" width="22px" />
          <span class="ml-1">{{ tx(`combatTypes.${selectedVariant.combatType}` as const) }}</span>
        </div>
      </div>
    </v-row>

    <client-only>
      <v-select
        v-if="character.variants"
        v-model="selectedVariant"
        :items="character.variants.map(e => ({title: tx(`paths.${e.path}` as const), value: e}))"
        :label="tx('common.path')"
        class="mt-4"
        hide-details
        style="max-width: 200px"
      />
    </client-only>

    <v-expansion-panels class="mt-4" mandatory="force">
      <SingleSliderPanel
        :material-defs="selectedVariant.materials"
        :character-id="character.id"
        :title="tx( 'characterDetailsPage.ascension')"
      />
      <SkillSlidersPanel
        :character-id="character.id"
        :material-defs="selectedVariant.materials"
        :title="tx('characterDetailsPage.skills')"
        :variant-path="character.variants ? selectedVariant.path : undefined"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="sass">

</style>
