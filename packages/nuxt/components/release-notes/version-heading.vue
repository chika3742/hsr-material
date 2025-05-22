<script lang="ts" setup>
import type { ReleaseNotesEntry } from "~/types/data/src/release-notes"

interface Props {
  item: ReleaseNotesEntry
  previousItem: ReleaseNote | undefined
}

defineProps<Props>()
</script>

<template>
  <div>
    <span
      v-if="item.funcVersion !== previousItem?.funcVersion"
      class="font-weight-bold"
    >v{{ item.funcVersion }}</span>
    <span
      v-if="item.dataVersion !== previousItem?.dataVersion"
      class="font-weight-bold"
    >D{{ item.dataVersion }}</span>
    <span style="font-size: 0.8em">{{ item.date }}</span>
  </div>
</template>

<style lang="sass" scoped>

</style>
