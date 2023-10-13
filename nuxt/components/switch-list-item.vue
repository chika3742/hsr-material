<script lang="ts" setup>
interface Props {
  title: string
  modelValue: boolean
}

defineProps<Props>()

interface Emits {
  (event: "update:modelValue", value: boolean): void
}

defineEmits<Emits>()
</script>

<template>
  <v-list-item :title="title" density="comfortable" @click="$emit('update:modelValue', !modelValue)">
    <template #append>
      <div class="px-2">
        <v-switch :model-value="modelValue" color="primary" density="compact" hide-details />
      </div>
    </template>
  </v-list-item>
</template>

<style lang="sass" scoped>

</style>
