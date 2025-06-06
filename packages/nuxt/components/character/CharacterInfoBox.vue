<script setup lang="ts">
export interface CharacterAttribute {
  title: string
  contentImageUrl?: string
  invertContentImage?: boolean
  content: string
}

defineProps<{
  imageUrl: string
  attributes: CharacterAttribute[]
}>()
</script>

<template>
  <div class="d-flex ga-4">
    <v-img
      :src="imageUrl"
      width="80px"
      max-width="80px"
      height="80px"
    />

    <div class="d-flex flex-column ga-1 justify-center">
      <slot name="rarity" />
      <div
        v-for="attr in attributes"
        :key="attr.title"
        class="d-flex align-center ga-2"
      >
        <span class="font-weight-bold">{{ attr.title }}</span>
        <v-img
          v-if="attr.contentImageUrl"
          :src="attr.contentImageUrl"
          width="22px"
          max-width="22px"
          height="22px"
          :class="{ invert: attr.invertContentImage }"
        />
        <span>{{ attr.content }}</span>
      </div>
    </div>
  </div>
</template>
