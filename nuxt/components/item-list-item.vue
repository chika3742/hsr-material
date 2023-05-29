<script lang="ts" setup>
withDefaults(defineProps<{
  item: Record<string, unknown> & { id: string, rarity: number }
  linkBasePath: string
  itemI18nKey: string
  imageFunc: (id: string) => string
  lines?: "one" | "two"
}>(), {
  lines: "one",
})
</script>

<template>
  <v-list-item :lines="lines" :to="localePath(`${linkBasePath}/${item.id}`)">
    <template #prepend>
      <v-img :src="imageFunc(item.id)" class="mr-2" height="45px" width="45px" />
    </template>

    <v-row align="center" no-gutters style="gap: 8px">
      <v-list-item-title>{{ tx(`${itemI18nKey}.${item.id}`) }}</v-list-item-title>
      <v-chip :color="`rank${item.rarity}`" size="small">
        <v-icon>mdi-star</v-icon>
        {{ item.rarity }}
      </v-chip>
    </v-row>

    <slot name="subtitle" />
  </v-list-item>
</template>

<style lang="sass" scoped>

</style>
