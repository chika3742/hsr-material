<script setup lang="ts">
import { useTheme } from "vuetify"
import gCharacters from "~/assets/data/genshin/characters.yaml"
import type { FilterOption } from "~/components/character/CharacterFilterMenu.vue"
import { genshinElements, genshinWeaponTypes, type GenshinElement, type GenshinWeaponType } from "~/types/data/enums"
import { isCharacterGroup, type GenshinCharacter } from "~/types/data/src/characters"
import type { PossessionStatus } from "~/types/strings"

usePageTitle(tx("pageTitles.characters"))
const i18n = useI18n()
const theme = useTheme()

const filters = ref({
  possessionStatus: undefined as PossessionStatus | undefined,
  rarity: undefined as number | undefined,
  element: undefined as GenshinElement | undefined,
  weaponType: undefined as GenshinWeaponType | undefined,
})

const filterOptions = computed<FilterOption[]>(() => [
  {
    key: "possessionStatus",
    title: tx(i18n, "charactersPage.possessionStatus"),
    items: [
      {
        value: "owned",
        icon: "mdi-check",
        text: tx(i18n, "charactersPage.owned"),
      },
      {
        value: "not-owned",
        icon: "mdi-close-box",
        text: tx(i18n, "charactersPage.notOwned"),
      },
    ],
  },
  {
    key: "rarity",
    title: tx(i18n, "common.rarity"),
    items: [
      {
        value: 4,
        text: "★4",
      },
      {
        value: 5,
        text: "★5",
      },
    ],
  },
  {
    key: "element",
    title: tx(i18n, "common.element"),
    items: genshinElements.map(e => ({
      value: e,
      text: tx(i18n, `elements.${e}`),
      iconUrl: getElementImage(e),
      invertIcon: !theme.current.value.dark,
    })),
  },
  {
    key: "weaponType",
    title: tx(i18n, "common.weaponType"),
    items: genshinWeaponTypes.map(e => ({
      value: e,
      text: tx(i18n, `weaponTypes.${e}`),
    })),
  },
])

const filteredCharacters = computed(() => {
  const filterOptions = {
    matchInVariant: {} as Record<string, unknown>,
    matchInRoot: {} as Record<string, unknown>,
  }

  if (filters.value.element !== undefined) {
    filterOptions.matchInVariant.element = filters.value.element
  }
  if (filters.value.weaponType !== undefined) {
    filterOptions.matchInVariant.weaponType = filters.value.weaponType
  }
  if (filters.value.rarity !== undefined) {
    filterOptions.matchInRoot.rarity = filters.value.rarity
  }

  // TODO: Possession Status

  return filterCharacters<GenshinCharacter>(gCharacters, filterOptions)
})
</script>

<template>
  <div>
    <v-btn
      prepend-icon="mdi-filter"
    >
      <span>{{ tx("common.filter") }}</span>
      <CharacterFilterMenu
        v-model="filters"
        activator="parent"
        :options="filterOptions"
      />
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
