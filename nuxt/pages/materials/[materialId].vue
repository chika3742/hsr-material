<script lang="ts" setup>
import materials from "~/assets/data/materials.csv"

definePageMeta({
  title: "materialDetails",
  itemI18nKey: "materialNames",
})

const route = useRoute()

if (!materials.some(e => e.id === route.params.materialId)) {
  throw createError({statusCode: 404, message: "Page not found"})
}

const material = materials.find(e => e.id === route.params.materialId)!

const characterUsage = getMaterialUsageCharacter(material.id)
</script>

<template>
  <div class="d-flex flex-column" style="gap: 16px">
    <v-row align="center" no-gutters>
      <v-img :src="getMaterialImage(material.id)" aspect-ratio="1" max-width="50" />
      <div class="ml-4">
        <v-icon v-for="i in material.rarity" :key="i" color="star" size="18">
          mdi-star
        </v-icon>
        <div class="mt-1" style="font-size: 0.85em; opacity: 0.8">
          {{ tx(`materialCategories.${material.category}`) }}
        </div>
      </div>
    </v-row>

    <v-card v-if="characterUsage.length >= 1" :title="tx('materialDetailsPage.characterUsage')">
      <v-card-text>
        <v-row no-gutters style="gap: 8px">
          <CharacterIconCard v-for="characterId in characterUsage" :key="characterId" :character-id="characterId" />
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="sass" scoped>

</style>
