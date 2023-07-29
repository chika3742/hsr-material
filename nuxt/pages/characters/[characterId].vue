<script setup lang="ts">
import characters from "~/assets/data/characters.yaml"
import {CharacterVariant} from "~/types/generated/characters.g"
import {useConfigStore} from "~/store/config"

definePageMeta({
  title: "characterDetails",
  itemI18nKey: "characterNames",
})

const route = useRoute()
const router = useRouter()
const config = useConfigStore()

if (!characters.some(e => e.id === route.params.characterId)) {
  throw createError({statusCode: 404, message: "Page not found", fatal: true})
}

const character = characters.find(e => e.id === route.params.characterId)!

const currentVariant = ref<CharacterVariant>(character.variants?.[0] ?? {
  path: character.path!,
  combatType: character.combatType!,
  materials: character.materials!,
})

watch(currentVariant, (value) => {
  history.replaceState(null, "", router.resolve({query: {variant: value.path}}).href)
})

onActivated(() => {
  if (character.variants && route.query.variant) {
    currentVariant.value = character.variants.find(e => e.path === route.query.variant) ?? currentVariant.value
  }
})

</script>

<template>
  <div>
    <v-row align="center" class="g-4" no-gutters>
      <!-- character image -->
      <v-img :src="getCharacterImage(character.id, 'small')" aspect-ratio="1" max-width="80px" width="80px" />

      <!-- character info -->
      <div class="d-flex flex-column" style="gap: 4px">
        <div>
          <v-icon v-for="i of character.rarity" :key="i" color="star" size="18">
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
          <v-img :src="getCombatTypeImage(currentVariant.combatType)" class="ml-3" max-width="22px" width="22px" />
          <span class="ml-1">{{ tx(`combatTypes.${currentVariant.combatType}` as const) }}</span>
        </div>
      </div>

      <!-- Is owned checkbox -->
      <v-checkbox-btn
        v-if="character.id !== 'trailblazer'"
        v-model="config.ownedCharacters"
        :value="character.id"
      >
        <template #label>
          <span class="text-no-wrap">{{ tx('characterDetailsPage.iHave') }}</span>
        </template>
      </v-checkbox-btn>
    </v-row>

    <client-only>
      <v-select
        v-if="character.variants"
        v-model="currentVariant"
        :items="character.variants.map(e => ({title: tx(`paths.${e.path}` as const), value: e}))"
        :label="tx('common.path')"
        class="mt-4"
        hide-details
        style="max-width: 200px"
      />
    </client-only>

    <v-expansion-panels class="mt-4" mandatory="force">
      <SingleSliderPanel
        :material-defs="currentVariant.materials"
        :character-id="character.id"
        :variant="character.variants ? currentVariant.path : null"
        :title="tx( 'characterDetailsPage.ascension')"
      />
      <SkillSlidersPanel
        :character-id="character.id"
        :material-defs="currentVariant.materials"
        :title="tx('characterDetailsPage.skills')"
        :variant="character.variants ? currentVariant.path : null"
      />
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="sass">

</style>
