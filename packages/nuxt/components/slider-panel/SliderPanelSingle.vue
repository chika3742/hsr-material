<script setup lang="ts">
import type { BookmarkableIngredient } from "~/types/bookmark/bookmarkables"

const props = defineProps<{
  modelValue: [number, number]
  title: string
  sliderTicks: number[]
  materials: BookmarkableIngredient[]
}>()

const emit = defineEmits<{
  (e: "update:model-value", value: [number, number]): void
}>()

const range = computed({
  get: () => props.modelValue,
  set: (value: [number, number]) => emit("update:model-value", value),
})
</script>

<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <SliderPanelLevelSlider
        v-model="range"
        :slider-ticks="sliderTicks"
      />
      <MaterialItems
        :items="materials"
        :range="range"
        :purpose-types="['ascension']"
        class="mt-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
