<script lang="ts" setup>
interface Props {
  title: string
  subtitle?: string
  lines?: "one" | "two"
  modelValue: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

interface Emits {
  (event: "update:modelValue", value: boolean): void
}

defineEmits<Emits>()
</script>

<template>
  <v-list-item
    :title="title"
    :subtitle="subtitle"
    :lines="lines"
    color="primary"
    density="comfortable"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <template #append>
      <div class="px-2">
        <v-switch
          :model-value="modelValue"
          color="primary"
          density="compact"
          hide-details
        />
      </div>
    </template>
  </v-list-item>
</template>

<style lang="sass" scoped>

</style>
