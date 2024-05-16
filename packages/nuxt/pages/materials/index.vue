<script lang="ts" setup>
import materials from "~/assets/data/materials.csv"
import {splitByField} from "#imports"

definePageMeta({
  title: "materials",
})

const filteringRarity = ref<number[]>([])
const expandedGroups = ref<number[]>([])

const materialList = computed(() => {
  return filteringRarity.value.length >= 1 ? materials.filter(e => e.rarity === filteringRarity.value[0]) : materials
})
</script>

<template>
  <div>
    <v-btn :color="filteringRarity.length >= 1 ? 'star' : ''" prepend-icon="mdi-filter">
      <span>{{ tx("common.filter") }}</span>

      <client-only>
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
      </client-only>
    </v-btn>

    <GroupedList
      v-model="expandedGroups"
      :image-func="getMaterialImage"
      :items="materialList"
      category-field="category"
      category-i18n-key="materialCategories"
      class="mt-4"
      item-i18n-key="materialNames"
      link-base-path="/materials"
    />
  </div>
</template>

<style lang="sass" scoped>

</style>
