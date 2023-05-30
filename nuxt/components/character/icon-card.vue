<script lang="ts" setup>
import {Path} from "~/types/generated/characters.g"

const props = defineProps<{
  characterId: string
  variant?: Path
}>()

const characterName = computed(() => {
  return tx(`characterNames.${props.characterId}`) + (props.variant ? ` (${tx(`paths.${props.variant}`)})` : "")
})
</script>

<template>
  <v-card :to="localePath({path: `/characters/${characterId}`, query: {variant}})" color="card">
    <div class="d-flex flex-column align-center">
      <v-img :src="getCharacterImage(characterId, 'small')" aspect-ratio="a" width="80px" />

      <v-card-subtitle v-show="$isTouchDevice" class="px-2 py-1">
        {{ characterName }}
      </v-card-subtitle>
    </div>

    <client-only>
      <v-tooltip :disabled="$isTouchDevice" activator="parent" location="bottom" open-delay="100">
        <span>{{ characterName }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>

</style>
