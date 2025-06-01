<template>
  <v-app-bar>
    <template #prepend>
      <v-btn
        v-if="$vuetify.display.mobile"
        :icon="navIcon"
        @click="$emit('nav-icon-clicked')"
      />
    </template>

    <v-app-bar-title>{{ title }}</v-app-bar-title>

    <template #append>
      <v-app-bar-nav-icon
        v-if="!hideSearchIcon"
        icon="mdi-magnify"
        @click="$emit('search-icon-clicked')"
      />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  hideSearchIcon?: boolean
  navIcon?: string
}>(), {
  navIcon: "mdi-menu",
})

defineEmits<{
  (e: "nav-icon-clicked"): void
  (e: "search-icon-clicked"): void
}>()

const title = usePageTitle()
</script>
