<script setup lang="ts">
import type { BookmarkableIngredient } from "~/types/bookmark/bookmarkables"
import type { PurposeType } from "~/types/data/enums"

export interface SliderConfig {
  key: string
  title: string
  sliderTicks: number[]
  purposeType: PurposeType
}

const props = defineProps<{
  modelValue: Record<string, [number, number]>
  title: string
  sliderConfigs: SliderConfig[]
  materials: BookmarkableIngredient[]
  enabledSkills: string[]
}>()

const emit = defineEmits<{
  (e: "update:model-value", value: Record<string, [number, number]>): void
  (e: "update:enabled-skills", value: string[]): void
}>()

const ranges = computed({
  get: () => props.modelValue,
  set: (value: Record<string, [number, number]>) => emit("update:model-value", value),
})

const enabledPurposeTypes = computed(() =>
  props.sliderConfigs
    .filter(config => props.enabledSkills.includes(config.key))
    .map(config => config.purposeType),
)

const toggleSkill = (key: string) => {
  const newEnabledSkills = props.enabledSkills.includes(key)
    ? props.enabledSkills.filter(k => k !== key)
    : [...props.enabledSkills, key]
  emit("update:enabled-skills", newEnabledSkills)
}
</script>

<template>
  <v-expansion-panel :title="title">
    <v-expansion-panel-text eager>
      <div
        v-for="config in sliderConfigs"
        :key="config.key"
      >
        <div class="d-flex align-center">
          <v-checkbox
            :model-value="enabledSkills.includes(config.key)"
            density="compact"
            class="flex-grow-0"
            hide-details
            @update:model-value="toggleSkill(config.key)"
          >
            <template #label>
              <span class="label-subtitle">{{ tx(`common.skillTypes.${config.key}`) }}</span>
              <span class="ml-2 text-primary">{{ config.title }}</span>
            </template>
          </v-checkbox>
        </div>
        <v-expand-transition>
          <SliderPanelLevelSlider
            v-show="enabledSkills.includes(config.key)"
            v-model="ranges[config.key]"
            :slider-ticks="config.sliderTicks"
          />
        </v-expand-transition>
        <v-divider class="my-1" />
      </div>
      <MaterialItems
        :items="materials"
        :range="ranges"
        :purpose-types="enabledPurposeTypes"
        class="mt-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style lang="sass" scoped>
h4 .label-subtitle
  color: rgb(var(--v-theme-surface-variant))
</style>
