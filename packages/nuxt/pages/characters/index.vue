<script setup lang="ts">
import characters from "~/assets/data/characters.yaml"
import { reactive } from "#imports"
import { type HsrCombatType, hsrCombatTypes, type HsrPath, hsrPaths } from "~/types/data/enums"
import { isCharacterGroup } from "~/types/data/src/characters"

usePageTitle(tx("pageTitles.characters"))

const config = useConfigStore()

const filter = reactive({
  rarity: [] as number[],
  path: [] as HsrPath[],
  combatType: [] as HsrCombatType[],
  possessionStatus: [] as ("owned" | "not-owned")[],
})

const filteredCharacters = computed(() => {
  return characters.filter((character) => {
    if (filter.path.length > 0
      && (isCharacterGroup(character)
        ? character.variants.every(e => !filter.path.includes(e.path))
        : !filter.path.includes(character.path))) {
      return false
    } else if (filter.combatType.length > 0
      && (isCharacterGroup(character)
        ? character.variants.every(e => !filter.combatType.includes(e.combatType))
        : !filter.combatType.includes(character.combatType))) {
      return false
    } else if (filter.rarity.length > 0 && !filter.rarity.includes(character.rarity)) {
      return false
    } else if (filter.possessionStatus.length > 0) {
      const owned = [...config.ownedCharacters, "trailblazer"] // Trailblazer is always owned
      if (filter.possessionStatus[0] === "owned" && !owned.includes(character.id)) {
        return false
      } else if (filter.possessionStatus[0] === "not-owned" && owned.includes(character.id)) {
        return false
      }
    }

    return true
  })
})
</script>

<template>
  <div>
    <v-row no-gutters>
      <!-- filter button -->
      <v-btn
        :color="Object.values(filter).some(e => e.length >= 1) ? 'star' : ''"
        prepend-icon="mdi-filter"
      >
        <span>{{ tx("common.filter") }}</span>
        <client-only>
          <v-menu
            activator="parent"
            :close-on-content-click="false"
            max-width="400px"
          >
            <v-card>
              <div>
                <div class="filter-row-title">
                  {{ tx("charactersPage.possessionStatus") }}
                </div>
                <v-list v-model:selected="filter.possessionStatus">
                  <v-row no-gutters>
                    <v-list-item
                      :title="tx('charactersPage.owned')"
                      prepend-icon="mdi-check"
                      value="owned"
                    />
                    <v-list-item
                      :title="tx('charactersPage.notOwned')"
                      prepend-icon="mdi-close"
                      value="not-owned"
                    />
                  </v-row>
                </v-list>
              </div>
              <v-divider />
              <div>
                <div class="filter-row-title">
                  {{ tx("common.rarity") }}
                </div>
                <v-list v-model:selected="filter.rarity">
                  <v-row no-gutters>
                    <v-list-item
                      v-for="rarity in [4, 5]"
                      :key="rarity"
                      :value="rarity"
                    >
                      <v-icon
                        v-for="i of rarity"
                        :key="i"
                        :class="i !== 1 ? 'ml-n1' : ''"
                        size="18"
                        color="star"
                      >
                        mdi-star
                      </v-icon>
                    </v-list-item>
                  </v-row>
                </v-list>
              </div>
              <v-divider />
              <div>
                <div class="filter-row-title">
                  {{ tx("common.path") }}
                </div>
                <v-list v-model:selected="filter.path">
                  <v-row no-gutters>
                    <v-list-item
                      v-for="path in hsrPaths"
                      :key="path"
                      class="flex-grow-1"
                      :title="tx(`paths.${path}` as const)"
                      :value="path"
                    >
                      <template #prepend>
                        <v-img
                          class="mr-2"
                          :src="getPathImage(path)"
                          width="25"
                          aspect-ratio="1"
                          :style="!$vuetify.theme.global.current.dark ? 'filter: brightness(0)' : ''"
                        />
                      </template>
                    </v-list-item>
                  </v-row>
                </v-list>
              </div>
              <v-divider />
              <div>
                <div class="filter-row-title">
                  {{ tx("common.combatType") }}
                </div>
                <v-list v-model:selected="filter.combatType">
                  <v-row no-gutters>
                    <v-list-item
                      v-for="type in hsrCombatTypes"
                      :key="type"
                      class="flex-grow-1"
                      :title="tx(`combatTypes.${type}` as const)"
                      :value="type"
                    >
                      <template #prepend>
                        <v-img
                          class="mr-2"
                          :src="getCombatTypeImage(type)"
                          width="30"
                          aspect-ratio="1"
                        />
                      </template>
                    </v-list-item>
                  </v-row>
                </v-list>
              </div>
            </v-card>
          </v-menu>
        </client-only>
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
        :to="$localePath(`/characters/${character.id}`)"
        :name="localize(character.name)"
        :image="getCharacterImage(character.id, 'full')"
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
