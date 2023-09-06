<template>
  <v-row no-gutters style="gap: 16px">
    <MaterialItem
      v-for="merged in mergeItems(items)"
      :key="getMaterialId(merged[0]) + '-' + merged[0].characterId"
      :items="merged"
      :purpose-types="purposeTypes"
    />
  </v-row>
</template>

<script lang="ts" setup>
import {PurposeType} from "~/types/strings"
import {BookmarkableIngredient, isBookmarkableMaterial} from "~/types/bookmark/bookmarkables"

defineProps<{
  items: BookmarkableIngredient[]
  purposeTypes: PurposeType[]
}>()

const getMaterialId = (item: BookmarkableIngredient) => {
  if (isBookmarkableMaterial(item)) {
    return item.materialId
  } else {
    return "exp"
  }
}
</script>
