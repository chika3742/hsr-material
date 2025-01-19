<script setup lang="ts">
import { definePageMeta, ref, watch } from "#imports"

definePageMeta({
  title: "Character Filter Menu",
})

const filter = ref({
  possessionStatus: [],
  rarity: [],
})

const extraFilterOptions: FilterOption[] = [
  {
    titleI18nKey: "title",
    key: "test",
    items: [
      {
        icon: "/_nuxt/assets/img/test_small.webp",
        textI18nKey: "text",
        value: "test",
        invertIconColor: true,
      },
    ],
  },
]

watch(filter, (_filter) => {
  console.log(JSON.parse(JSON.stringify(_filter)))
})
</script>

<template>
  <v-btn
    prepend-icon="mdi-filter"
  >
    <span>絞り込み</span>
    <CharacterFilterMenu
      v-model:filter="filter"
      :extra-filter-options="extraFilterOptions"
    />
  </v-btn>
</template>

<style scoped>

</style>
