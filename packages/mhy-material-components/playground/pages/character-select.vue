<script setup lang="ts">
import { definePageMeta, ref } from "#imports"

definePageMeta({
  title: "CharacterSelect",
})

const value = ref<string>()

const characters = [
  { id: "test1", image: "/_nuxt/assets/img/test_small.webp" },
  { id: "test2", image: "/_nuxt/assets/img/test_small.webp" },
  { id: "test3", image: "/_nuxt/assets/img/test_small.webp" },
  { id: "test4", image: "/_nuxt/assets/img/test_small.webp" },
  { id: "test5", image: "/_nuxt/assets/img/test_small.webp" },
  { id: "test6", image: "/_nuxt/assets/img/test_small.webp" },
]
</script>

<template>
  <div>
    <CharacterSelect
      v-model="value"
      :characters="characters"
      label="test character select"
      max-width="400px"
      error="error message"
    />

    <CharacterSelect
      v-model="value"
      :characters="characters"
      label="test character select 2"
      max-width="400px"
      :filter="(id) => Number(id.substring(4)) % 2 === 0"
      filter-disable-checkbox-text="すべて表示"
    />
  </div>
</template>

<style scoped>

</style>
