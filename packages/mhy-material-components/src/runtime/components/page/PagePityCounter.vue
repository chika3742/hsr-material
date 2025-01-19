<script setup lang="ts">
import { useI18n } from "#imports"

interface Props {
}

defineProps<Props>()

const i18n = useI18n()

const locs = {
  get title() {
    return i18n.t("pityCounter.title")
  },
}
</script>

<template>
  <div>
    {{ locs.title }}
  </div>
</template>

<style scoped>

</style>
