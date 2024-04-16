<script setup lang="ts">
import characters from "~/assets/data/characters.yaml"
import type {CombatType, Path} from "~/types/generated/characters.g"
import {reactive} from "#imports"

definePageMeta({
  title: "characters",
})

const config = useConfigStore()

const paths = new Set(characters.map(e => e.path ?? "destruction"))
const combatTypes = new Set(characters.map(e => e.combatType ?? "physical"))

const filter = reactive({
  rarity: [] as number[],
  path: [] as Path[],
  combatType: [] as CombatType[],
  possessionStatus: [] as ("owned" | "not-owned")[],
})

const filteredCharacters = computed(() => {
  return characters.filter((character) => {
    if (filter.path.length > 0 && (!character.path || !filter.path.includes(character.path))) {
      return false
    } else if (filter.combatType.length > 0 && (!character.combatType || !filter.combatType.includes(character.combatType))) {
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
      <v-btn :color="Object.values(filter).some(e => e.length >= 1) ? 'star' : ''" prepend-icon="mdi-filter">
        <span>{{ tx("common.filter") }}</span>
        <client-only>
          <v-menu activator="parent" :close-on-content-click="false" max-width="400px">
            <v-card>
              <div>
                <div class="filter-row-title">
                  {{ tx("charactersPage.possessionStatus") }}
                </div>
                <v-list v-model:selected="filter.possessionStatus">
                  <v-row no-gutters>
                    <v-list-item :title="tx('charactersPage.owned')" prepend-icon="mdi-check" value="owned" />
                    <v-list-item :title="tx('charactersPage.notOwned')" prepend-icon="mdi-close" value="not-owned" />
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
                    <v-list-item v-for="rarity in [4, 5]" :key="rarity" :value="rarity">
                      <v-icon v-for="i of rarity" :key="i" :class="i !== 1 ? 'ml-n1' : ''" size="18" color="star">
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
                      v-for="path in paths"
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
                      v-for="type in combatTypes"
                      :key="type"
                      class="flex-grow-1"
                      :title="tx(`combatTypes.${type}` as const)"
                      :value="type"
                    >
                      <template #prepend>
                        <v-img class="mr-2" :src="getCombatTypeImage(type)" width="30" aspect-ratio="1" />
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

    <v-row no-gutters class="mt-4" style="gap: 16px">
      <CharacterCard
        v-for="character in filteredCharacters"
        :key="character.id"
        :attribute-images="[
          ...character.combatType ? [getCombatTypeImage(character.combatType)] : [],
          ...character.path ? [getPathImage(character.path)] : [],
        ]"
        :character-id="character.id"
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
