<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
  title: "Release Notes",
})

const releaseNotes: ReleaseNote[] = [
  {
    date: "2023/01/01",
    funcVersion: "3.0.0",
    dataVersion: "5.0.0",
    isMajor: false,
    content: "### Release Notes",
  },
]
</script>

<template>
  <PageReleaseNotes :release-notes="releaseNotes" />
</template>

<style scoped>

</style>
