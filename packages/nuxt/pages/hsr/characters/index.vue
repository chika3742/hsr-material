<script setup lang="ts">
import { useTheme } from "vuetify"
import hCharacters from "~/assets/data/characters.yaml"
import { type HsrCombatType, hsrCombatTypes, type HsrPath, hsrPaths } from "~/types/data/enums"
import type { HsrCharacter } from "~/types/data/src/characters"
import { isCharacterGroup } from "~/types/data/src/characters"
import type { FilterOption } from "~/components/character/CharacterFilterMenu.vue"
import type { PossessionStatus } from "~/types/strings"

usePageTitle(tx("pageTitles.characters"))

const i18n = useI18n()
const theme = useTheme()
const config = useConfigStore()

const filter = ref({
  rarity: undefined as number | undefined,
  path: undefined as HsrPath | undefined,
  combatType: undefined as HsrCombatType | undefined,
  possessionStatus: undefined as PossessionStatus | undefined,
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
        value: "notOwned",
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
    key: "path",
    title: tx(i18n, "common.path"),
    items: hsrPaths.map(e => ({
      value: e,
      text: tx(i18n, `paths.${e}`),
      iconUrl: getPathImage(e),
      invertIcon: !theme.current.value.dark,
    })),
  },
  {
    key: "combatType",
    title: tx(i18n, "common.combatType"),
    items: hsrCombatTypes.map(e => ({
      value: e,
      text: tx(i18n, `combatTypes.${e}`),
      iconUrl: getCombatTypeImage(e),
    })),
  },
])

const filteredCharacters = computed(() => {
  const filterOptions = {
    matchInVariant: {} as Record<string, unknown>,
    matchInRoot: {} as Record<string, unknown>,
  }

  if (filter.value.path !== undefined) {
    filterOptions.matchInVariant.path = filter.value.path
  }
  if (filter.value.combatType !== undefined) {
    filterOptions.matchInVariant.combatType = filter.value.combatType
  }
  if (filter.value.rarity !== undefined) {
    filterOptions.matchInRoot.rarity = filter.value.rarity
  }

  let filtered = filterCharacters<HsrCharacter>(hCharacters, filterOptions)
  if (filter.value.possessionStatus !== undefined) {
    filtered = filtered.filter((character) => {
      const owned = [...config.ownedCharacters, "trailblazer"] // Trailblazer is always owned
      if (filter.value.possessionStatus === "owned" && owned.includes(character.id)) {
        return true
      } else if (filter.value.possessionStatus === "notOwned" && !owned.includes(character.id)) {
        return true
      }
      return false
    })
  }

  return filtered
})
</script>

<template>
  <div>
    <v-row no-gutters>
      <!-- filter button -->
      <v-btn
        :color="Object.values(filter).some(e => e) ? 'star' : ''"
        prepend-icon="mdi-filter"
      >
        <span>{{ tx("common.filter") }}</span>
        <CharacterFilterMenu
          v-model="filter"
          activator="parent"
          :options="filterOptions"
        />
      </v-btn>
    </v-row>

    <v-row
      no-gutters
      class="mt-4"
      style="gap: 16px"
    >
      <CharacterCard
        v-for="character in filteredCharacters"
        :key="character.id"
        :attribute-images="[
          ...!isCharacterGroup(character) ? [getCombatTypeImage(character.combatType)] : [],
          ...!isCharacterGroup(character) ? [getPathImage(character.path)] : [],
        ]"
        :to="$localePath(`/hsr/characters/${character.id}`)"
        :name="localize(character.name)"
        :image="getHsrCharacterImage(character.id, 'full')"
      />
    </v-row>
  </div>
</template>

<style scoped lang="sass">
.filter-row-title
  padding: 4px 16px 0
  margin-top: 8px
  font-weight: bold
</style>
