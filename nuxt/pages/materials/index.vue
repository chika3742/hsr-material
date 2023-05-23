<script lang="ts" setup>
import materials from "~/assets/data/materials.csv"
import {splitByField} from "#imports"

definePageMeta({
  title: "materials",
})

const filteringRarity = ref<number[]>([])

const groups = computed(() => {
  const source = filteringRarity.value.length >= 1 ? materials.filter(e => e.rarity === filteringRarity.value[0]) : materials
  return splitByField(source, "category")
})
</script>

<template>
  <div>
    <v-btn :color="filteringRarity.length >= 1 ? 'star' : ''" prepend-icon="mdi-filter">
      <span>{{ tx("common.filter") }}</span>

      <v-menu activator="parent">
        <v-list v-model:selected="filteringRarity">
          <v-list-item
            v-for="g in splitByField(materials, 'rarity')"
            :key="g[0].rarity"
            :value="g[0].rarity"
          >
            <v-row no-gutters>
              <v-icon v-for="i in g[0].rarity" :key="i" color="star" size="18">
                mdi-star
              </v-icon>
            </v-row>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-list class="mt-4" style="user-select: none">
      <v-list-group v-for="group in groups" :key="group[0].id">
        <template #activator="{props}">
          <v-list-item
            :title="tx(`materialCategories.${group[0].category}`)"
            v-bind="props"
          >
            <template #prepend>
              <v-img :src="getMaterialImage(group[0].id)" aspect-ratio="1" class="mr-2" width="35px" />
            </template>
          </v-list-item>
        </template>

        <v-list-item
          v-for="material in group"
          :key="material.id"
          :to="localePath(`/materials/${material.id}`)"
        >
          <template #prepend>
            <v-img :src="getMaterialImage(material.id)" aspect-ratio="1" class="mr-2" width="35px" />
          </template>
          <v-row align="center" no-gutters style="gap: 8px">
            <v-list-item-title>{{ tx(`materialNames.${material.id}`) }}</v-list-item-title>
            <v-chip :color="`rank${material.rarity}`" size="small">
              <v-icon>mdi-star</v-icon>
              {{ material.rarity }}
            </v-chip>
          </v-row>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<style lang="sass" scoped>

</style>
