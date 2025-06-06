<script setup lang="ts">
import type { VMenu } from "vuetify/components"

export interface FilterOption {
  key: string
  title: string
  items: {
    iconUrl?: string
    icon?: string
    invertIcon?: boolean
    text: string
    value: any
  }[]
}

interface Props {
  modelValue: Record<string, unknown>
  activator?: VMenu["activator"]
  options: FilterOption[]
}

const props = defineProps<Props>()

interface Emits {
  (e: "update:model-value", value: Props["modelValue"]): void
}

const emit = defineEmits<Emits>()

const setFilter = (key: string, value: unknown) => {
  emit("update:model-value", {
    ...props.modelValue,
    [key]: value,
  })
}
</script>

<template>
  <v-menu
    v-slot="{ isActive }"
    :activator="activator"
    :close-on-content-click="false"
    max-width="400px"
    width="100%"
  >
    <v-card>
      <v-btn
        v-if="$vuetify.display.xs"
        class="position-absolute top-0 right-0 ma-1"
        variant="text"
        icon="mdi-close"
        @click="isActive.value = false"
      />

      <section
        v-for="option in options"
        :key="option.key"
        class="d-flex flex-column ga-2"
      >
        <h4>{{ option.title }}</h4>
        <v-item-group
          :model-value="modelValue[option.key]"
          class="selection-grid-container"
          @update:model-value="setFilter(option.key, $event)"
        >
          <v-item
            v-for="item in option.items"
            :key="item.value"
            v-slot="{ isSelected, toggle }"
            :value="item.value"
          >
            <v-list-item
              :title="item.text"
              :active="isSelected"
              height="45px"
              color="primary"
              @click="toggle"
            >
              <template #prepend>
                <v-img
                  v-if="item.iconUrl"
                  :src="item.iconUrl"
                  width="30"
                  height="30"
                  class="mr-4"
                  :class="{ invert: item.invertIcon }"
                />
                <v-icon
                  v-else-if="item.icon"
                  :icon="item.icon"
                />
              </template>
            </v-list-item>
          </v-item>
        </v-item-group>
        <v-divider />
      </section>
    </v-card>
  </v-menu>
</template>

<style lang="sass" scoped>
h4
  padding: 4px 16px 0
  margin-top: 8px
  font-weight: bold

.selection-grid-container
  display: grid
  grid-template-columns: 1fr 1fr
</style>
