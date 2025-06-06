<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<template>
  <div class="d-flex">
    <v-icon
      v-for="i of count"
      :key="i"
      color="star"
      size="18"
    >
      mdi-star
    </v-icon>
  </div>
</template>
