<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
  title: "Character Card",
})
</script>

<template>
  <CharacterCard
    character-id="test"
    image="/_nuxt/assets/img/test.webp"
    :attribute-images="[]"
  />
</template>

<style scoped>

</style>
