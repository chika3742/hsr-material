<script lang="ts" setup>
import type { ReleaseNotesEntry } from "~/types/data/src/release-notes"

interface Props {
  item: ReleaseNotesEntry
  previousItem?: ReleaseNotesEntry | undefined
}

defineProps<Props>()
</script>

<template>
  <div>
    <span
      v-if="item.version"
      class="font-weight-bold"
    >v{{ item.version }}</span>
    <!-- Retained for backward compatibility -->
    <span
      v-if="item.funcVersion !== previousItem?.funcVersion && !item.version"
      class="font-weight-bold"
    >v{{ item.funcVersion }}</span>
    <span
      v-if="item.dataVersion !== previousItem?.dataVersion && !item.version"
      class="font-weight-bold"
    >D{{ item.dataVersion }}</span>
    <span style="font-size: 0.8em">{{ item.date }}</span>
  </div>
</template>

<style lang="sass" scoped>

</style>
