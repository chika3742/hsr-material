<script setup lang="ts">
import gCharacters from "~/assets/data/genshin/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"

usePageTitle(tx("pageTitles.characters"))

const filteredCharacters = computed(() => gCharacters)
</script>

<template>
  <div>
    <v-btn
      prepend-icon="mdi-filter"
      text="絞り込み(PH)"
    >
      <v-menu activator="parent">
        <CharacterFilterMenu filter="" />
      </v-menu>
    </v-btn>
    <v-row
      no-gutters
      class="mt-4"
      style="gap: 16px"
    >
      <CharacterCard
        v-for="character in filteredCharacters"
        :key="character.id"
        :attribute-images="[
          ...!isCharacterGroup(character) ? [getElementImage(character.element)] : [],
        ]"
        :to="$localePath(`/genshin/characters/${character.id}`)"
        :name="localize(character.name)"
        :image="getGenshinCharacterImage(character.id, 'full')"
      />
    </v-row>
  </div>
</template>
