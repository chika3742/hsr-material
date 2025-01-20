<script setup lang="ts">
import { tx } from "../../utils/i18n"

interface Props {
  modelValue: string
  items: BottomNavigationItem[]
}
defineProps<Props>()

interface Emits {
  (e: "update:modelValue", value: string): void
  (e: "click-item-twice", value: string): void
}
defineEmits<Emits>()
</script>

<template>
  <v-bottom-navigation
    :model-value="modelValue"
    color="primary"
    class="bottom-nav"
    mandatory
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-btn
      v-for="item in items"
      :key="item.path"
      v-safe-area="{ bottom: true }"
      :value="item.path"
      class="bottom-nav__btn"
      :class="modelValue === item.path ? 'selected' : ''"
      @click="modelValue === item.path && $emit('click-item-twice', item.path)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ tx(item.labelI18nKey) }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style lang="sass" scoped>
.bottom-nav
  height: calc(env(safe-area-inset-bottom) + 56px) !important

  &__btn
    flex: 1
    word-break: keep-all

    &.selected
      flex: 1.2
</style>
