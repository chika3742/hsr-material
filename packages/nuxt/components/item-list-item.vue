<script lang="ts" setup>
withDefaults(defineProps<{
  itemId: string
  itemRarity: number
  linkBasePath: string
  preserveQuery?: boolean
  itemI18nKey: string
  imageFunc: (id: string) => string
  lines?: "one" | "two"
}>(), {
  lines: "one",
})
</script>

<template>
  <v-list-item
    :lines="lines"
    :to="localePath({
      path: `${linkBasePath}/${itemId}`,
      query: preserveQuery ? $route.query : {},
    })"
  >
    <template #prepend>
      <v-img
        :src="imageFunc(itemId)"
        aspect-ratio="1"
        class="mr-2"
        width="45px"
      />
    </template>

    <v-row
      align="center"
      no-gutters
      style="gap: 8px"
    >
      <v-list-item-title>{{ tx(`${itemI18nKey}.${itemId}`) }}</v-list-item-title>
      <v-chip
        :color="`rarity-${itemRarity}`"
        size="small"
      >
        <v-icon>mdi-star</v-icon>
        {{ itemRarity }}
      </v-chip>
    </v-row>

    <slot name="subtitle" />
  </v-list-item>
</template>

<style lang="sass" scoped>

</style>
