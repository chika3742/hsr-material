<script lang="ts" setup>
import lightCones from "~/assets/data/light-cones.yaml"
import EmphasizedText from "~/components/emphasized-text.vue"
import type {CharacterIdWithVariant} from "~/types/strings"
import characters from "~/assets/data/characters.yaml"

definePageMeta({
  title: "lightConeDetails",
  itemI18nKey: "lightConeNames",
})

const route = useRoute()

if (!lightCones.some(e => e.id === route.params.lightConeId)) {
  throw createError({statusCode: 404, message: "Page not found", fatal: true})
}

const lightCone = lightCones.find(e => e.id === route.params.lightConeId)!

const selectedCharacter = ref<CharacterIdWithVariant>()

const characterSelectFilter = (id: string): boolean => {
  const variant = toVariant(id)
  if (variant !== null) {
    return variant === lightCone.path
  } else {
    return characters.find(e => e.id === id)!.path === lightCone.path
  }
}
</script>

<template>
  <div>
    <v-row align="center" no-gutters>
      <v-img :src="getLightConeImage(lightCone.id)" max-width="60px" width="60px" />
      <div class="ml-4 d-flex flex-column" style="gap: 4px">
        <div>
          <v-icon v-for="i of lightCone.rarity" :key="i" color="star" size="18">
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
      <EmphasizedText :text="tx(`lightConeSkillDescriptions.${lightCone.id}`)" class="pl-4 mt-1" />
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

    <v-expansion-panels mandatory="force">
      <SingleSliderPanel
        v-if="selectedCharacter"
        :material-defs="lightCone.materials"
        :title="tx('lightConeDetailsPage.ascension')"
        :light-cone-id="lightCone.id"
        :character-id="toCharacterId(selectedCharacter)"
        :variant="toVariant(selectedCharacter)"
      />

      <v-expansion-panel :title="tx('lightConeDetailsPage.recommendedCharacters')" text="Coming soon..." />
    </v-expansion-panels>
  </div>
</template>

<style lang="sass">
.hmn-desc-emphasis
  color: rgb(var(--v-theme-secondary))
  font-weight: bold
</style>
