<script lang="ts" setup>
const props = withDefaults(defineProps<{
  name: string
  to: string
  rarity: number
  imagePath: string
  /** Passes the query parameters to the link destinations. */
  preserveQuery?: boolean
  lines?: "one" | "two"
}>(), {
  lines: "one",
})

const toPath = new URL(props.to, "https://dummy").pathname
</script>

<template>
  <v-list-item
    :lines="lines"
    :to="$localePath({
      path: toPath,
      query: preserveQuery ? $route.query : {},
    })"
  >
    <template #prepend>
      <v-img
        :src="imagePath"
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
      <v-list-item-title>{{ name }}</v-list-item-title>
      <v-chip
        :color="`rarity-${rarity}`"
        size="small"
      >
        <v-icon>mdi-star</v-icon>
        {{ rarity }}
      </v-chip>
    </v-row>

    <slot name="subtitle" />
  </v-list-item>
</template>

<style lang="sass" scoped>

</style>
