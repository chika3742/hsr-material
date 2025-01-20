<script setup lang="ts">
import { definePageMeta, ref } from "#imports"

definePageMeta({
  title: "Footer",
})

const theme = ref<ThemeSetting>("auto")
</script>

<template>
  <AppFooter
    v-model:theme-setting="theme"
    current-version="1.0.0"
    repository-url=""
    feedback-page-url=""
    hoyolab-article-url=""
  />
</template>

<style scoped>

</style>
