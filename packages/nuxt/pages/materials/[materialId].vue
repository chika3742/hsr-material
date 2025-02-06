<script lang="ts" setup>
import materials from "~/assets/data/materials.csv"

definePageMeta({
  title: "materialDetails",
  itemI18nKey: "materialNames",
})

const route = useRoute()

if (!materials.some(e => e.id === route.params.materialId)) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const material = materials.find(e => e.id === route.params.materialId)!

const characterUsage = getMaterialUsageCharacter(material.id)
const lightConeUsage = getMaterialUsageLightCone(material.id)
</script>

<template>
  <div
    class="d-flex flex-column"
    style="gap: 16px"
  >
    <v-row
      align="center"
      no-gutters
    >
      <v-img
        :src="getMaterialImage(material.id)"
        aspect-ratio="1"
        max-width="50px"
        width="50px"
      />
      <div class="ml-4">
        <v-icon
          v-for="i in material.rarity"
          :key="i"
          color="star"
          size="18"
        >
          mdi-star
        </v-icon>
        <div
          class="mt-1"
          style="font-size: 0.85em; opacity: 0.8"
        >
          {{ tx(`materialCategories.${material.category}`) }}
        </div>
      </div>
    </v-row>

    <v-card
      v-if="characterUsage.length >= 1"
      :title="tx('materialDetailsPage.characterUsage')"
    >
      <v-card-text>
        <v-row
          no-gutters
          style="gap: 8px"
        >
          <CharacterIconCard
            v-for="character in characterUsage"
            :key="character.id"
            :character-id-with-variant="toCharacterIdWithVariant(character.id, character.variant ?? null)"
            :image-url="getCharacterImage(toCharacterIdWithVariant(character.id, character.variant ?? null), 'small')"
          />
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      v-if="lightConeUsage.length >= 1"
      :title="tx('materialDetailsPage.lightConeUsage')"
    >
      <v-list>
        <template
          v-for="group in splitByField(lightConeUsage, 'path')"
          :key="group[0].id"
        >
          <v-list-subheader>
            {{ $t(`paths.${group[0].path}`) }}
          </v-list-subheader>

          <ItemListItem
            v-for="lightCone in group"
            :key="lightCone.id"
            :image-func="getLightConeImage"
            :item-id="lightCone.id"
            :item-rarity="lightCone.rarity"
            item-i18n-key="lightConeNames"
            link-base-path="/light-cones"
          />
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<style lang="sass" scoped>

</style>
