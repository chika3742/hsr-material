<script lang="ts" setup>
import GroupedList from "~/components/grouped-list.vue"
import lightCones from "~/assets/data/light-cones.yaml"

definePageMeta({
  title: "lightCones",
})

const items = computed(() => {
  return lightCones.sort((a, b) => b.rarity - a.rarity)
})
</script>

<template>
  <GroupedList
    :image-func="getLightConeImage"
    :items="items"
    category-field="path"
    category-i18n-key="paths"
    item-i18n-key="lightConeNames"
    link-base-path="/light-cones"
  />
</template>

<style lang="sass" scoped />
