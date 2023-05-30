<script lang="ts" setup>
defineProps<{
  characterId: string
}>()
</script>

<template>
  <v-card :to="localePath(`/characters/${characterId}`)" color="card">
    <div class="d-flex flex-column align-center">
      <v-img :src="getCharacterImage(characterId, 'small')" aspect-ratio="a" width="80px" />

      <v-card-subtitle v-show="$isTouchDevice" class="px-2 py-1">
        {{ tx(`characterNames.${characterId}`) }}
      </v-card-subtitle>
    </div>

    <client-only>
      <v-tooltip :disabled="$isTouchDevice" activator="parent" location="bottom" open-delay="100">
        <span>{{ tx(`characterNames.${characterId}`) }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>

</style>
