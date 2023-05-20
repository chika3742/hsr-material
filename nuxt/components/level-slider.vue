<template>
  <div>
    <v-range-slider
      v-model="rangeIndexes"
      :max="sliderTicks.length - 1"
      :min="0"
      :ticks="ticks"
      class="mt-2"
      hide-details
      show-ticks="always"
      step="1"
      strict
      thumb-label
    >
      <template #thumb-label="{modelValue: _modelValue}">
        <div style="width: 52px">
          {{ _modelValue === rangeIndexes[0] ? "現在のLv" : "目標のLv" }}
        </div>
      </template>
    </v-range-slider>
    <div class="mx-2 mt-3 levels">
      <span>Lv. </span>
      <span class="font-cairo levels__number">{{ modelValue[0] }}</span>
      <v-icon icon="ms:double_arrow" style="margin-bottom: 6px" />
      <span class="font-cairo levels__number">{{ modelValue[1] }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "#imports"

const props = defineProps<{
  modelValue: number[]
  sliderTicks: number[]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void
}>()

const ticks = computed(() => {
  const result: Record<number, string> = {}

  props.sliderTicks.forEach((e, i) => {
    result[i] = e.toString()
  })

  return result
})

const rangeIndexes = computed({
  get() {
    return props.modelValue.map(e => props.sliderTicks.indexOf(e))
  },
  set(value) {
    emit("update:modelValue", value.map(e => props.sliderTicks[e]))
  },
})
</script>

<style lang="sass" scoped>
.levels
  &__number
    display: inline-block
    text-align: end
    margin: 0 4px
    width: 25px
    font-size: 1.5em

</style>
