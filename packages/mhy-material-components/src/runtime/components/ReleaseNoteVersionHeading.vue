<script lang="ts" setup>
interface Props {
  item: ReleaseNote
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
