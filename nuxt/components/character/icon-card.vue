<script lang="ts" setup>
defineProps<{
  characterId: string
}>()
</script>

<template>
  <v-card :to="localePath(`/characters/${characterId}`)">
    <v-img :src="getCharacterImage(characterId, 'small')" aspect-ratio="a" width="80px" />

    <client-only>
      <v-tooltip activator="parent" location="bottom" open-delay="100">
        <span>{{ tx(`characterNames.${characterId}`) }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>

</style>
