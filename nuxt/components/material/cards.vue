<template>
  <v-row no-gutters style="gap: 16px">
    <MaterialCard v-for="(item, i) in mergeItems(items)" :key="i" :items="item" />
  </v-row>
</template>

<script lang="ts" setup>
import {BookmarkableIngredient} from "~/types/bookmarkable-ingredient"

defineProps<{
  items: BookmarkableIngredient[]
}>()

</script>
