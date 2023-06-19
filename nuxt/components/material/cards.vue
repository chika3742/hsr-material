<template>
  <v-row no-gutters style="gap: 16px">
    <MaterialCard v-for="(item, i) in mergeItems(items)" :key="i" :items="item" :purpose-types="purposeTypes" />
  </v-row>
</template>

<script lang="ts" setup>
import {BookmarkableIngredient} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"

defineProps<{
  items: BookmarkableIngredient[]
  purposeTypes: PurposeType[]
}>()
</script>
