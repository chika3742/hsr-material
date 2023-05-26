<script setup lang="ts">
import {Character} from "~/types/generated/characters.g"

defineProps<{
  character: Character
}>()
</script>

<template>
  <v-card :to="localePath(`/characters/${character.id}`)" :v-slot:loader="false" class="character-card">
    <v-img
      :src="getCharacterImage(character.id, 'full')"
      :style="`filter: brightness(${$vuetify.theme.name === 'dark' ? '0.8' : '1'})`"
    />
    <v-row
      v-if="character.combatType && character.path"
      no-gutters
      style="position: absolute; right: 0; top: 0; padding: 4px 4px 4px 16px; background: linear-gradient(to left, #0007, #0007 80%,transparent)"
    >
      <v-img
        :src="getCombatTypeImage(character.combatType)"
        width="25px"
        aspect-ratio="1"
        :style="`filter: brightness(${$vuetify.theme.name === 'dark' ? '0.8' : '1'})`"
      />
      <v-img
        :src="getPathImage(character.path)"
        width="25px"
        aspect-ratio="1"
        :style="`filter: brightness(${$vuetify.theme.name === 'dark' ? '0.8' : '1'})`"
      />
    </v-row>
    <span class="font-kaisei-opti">{{ $t(`characterNames.${character.id}`) }}</span>
  </v-card>
</template>

<style lang="sass" scoped>
.character-card
  aspect-ratio: 2 / 1
  max-width: 250px
  width: calc(50% - 16px)

  &__element
    position: absolute
    right: 12%
    top: 20%
    bottom: 20%
    aspect-ratio: 1
    opacity: 0.7
    background-size: cover
    filter: brightness(0.5)

  span
    position: absolute
    bottom: 0
    left: 0
    padding: 4px 16px
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0))
    font-size: 1.3rem
    color: white
    text-shadow: 0 0 4px black

    @media (max-width: 450px)
      font-size: 1em
      padding: 2px 8px

</style>
