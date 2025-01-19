<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
  title: "Character Icon Card",
})
</script>

<template>
  <v-row no-gutters>
    <CharacterIconCard
      character-id-with-variant="test"
      image-url="/_nuxt/assets/img/test_small.webp"
    />
    <CharacterIconCard
      character-id-with-variant="test_variant"
      image-url="/_nuxt/assets/img/test_small.webp"
    />
  </v-row>
</template>

<style scoped>

</style>
