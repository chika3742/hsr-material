<script lang="ts" setup>
import { useNuxtApp } from "#imports"

defineProps<{
  to: string
  name: string
  imageUrl: string
}>()

const { $isTouchDevice } = useNuxtApp()
</script>

<template>
  <v-card
    :to="to"
    color="card"
  >
    <div class="d-flex flex-column align-center">
      <v-img
        :src="imageUrl"
        aspect-ratio="1"
        width="80px"
      />

      <v-card-subtitle
        v-show="$isTouchDevice"
        class="px-2 py-1"
      >
        {{ name }}
      </v-card-subtitle>
    </div>

    <client-only>
      <v-tooltip
        :disabled="$isTouchDevice as boolean"
        activator="parent"
        location="bottom"
        open-delay="100"
      >
        <span>{{ name }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>

</style>
