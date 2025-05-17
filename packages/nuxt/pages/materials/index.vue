<script lang="ts" setup>
import materials from "~/assets/data/materials.yaml"
import { splitByField } from "#imports"
import type { GroupedListGroup, GroupedListItem } from "~/components/grouped-list.vue"
import materialsMeta from "~/assets/data/materials-meta.yaml"

usePageTitle(tx("pageTitles.materials"))

const i18n = useI18n()

const filteringRarity = ref<number[]>([])
const expandedGroups = ref<number[]>([])

const filteredMaterials = computed<GroupedListItem[]>(() => {
  return (filteringRarity.value.length >= 1 ? materials.filter(e => e.rarity === filteringRarity.value[0]) : materials).map(e => ({
    key: e.id,
    name: localize(e.name, i18n),
    imagePath: getMaterialImage(e.id),
    rarity: e.rarity,
    groupKey: e.category,
    to: `/materials/${e.id}`,
  }))
})

const groups = computed<GroupedListGroup[]>(() => {
  return materialsMeta.categories
    .filter(e => filteredMaterials.value.some(f => f.groupKey == e.id))
    .map(e => ({
      title: localize(e.title, i18n),
      groupKey: e.id,
    }))
})
</script>

<template>
  <div>
    <v-btn
      :color="filteringRarity.length >= 1 ? 'star' : ''"
      prepend-icon="mdi-filter"
    >
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
                <v-icon
                  v-for="i in g[0].rarity"
                  :key="i"
                  color="star"
                  size="18"
                >
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
      :groups="groups"
      :items="filteredMaterials"
      class="mt-4"
    />
  </div>
</template>

<style lang="sass" scoped>

</style>
