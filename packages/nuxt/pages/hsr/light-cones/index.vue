<script lang="ts" setup>
import GroupedList, { type GroupedListGroup, type GroupedListItem } from "~/components/grouped-list.vue"
import lightCones from "~/assets/data/light-cones.yaml"
import EmphasizedText from "~/components/emphasized-text.vue"
import characters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"
import { hsrPaths } from "~/types/data/enums"

const route = useRoute()
const i18n = useI18n()
usePageTitle(tx("pageTitles.lightCones"))

const filteringRarity = ref<number[]>([])
const expanded = ref<number[]>([])
const showSkillDescriptions = ref(false)

const filteredItems = computed(() => {
  return lightCones.filter(e => filteringRarity.value.length === 0 || e.rarity === filteringRarity.value[0]).sort((a, b) => b.rarity - a.rarity)
})
const groupItems = computed<GroupedListItem[]>(() => {
  return filteredItems.value.map(e => ({
    key: e.id,
    name: localize(e.name, i18n),
    imagePath: getLightConeImage(e.id),
    groupKey: e.path,
    rarity: e.rarity,
    to: `/hsr/light-cones/${e.id}`,
    lines: showSkillDescriptions.value ? "two" : "one",
    skillDesc: localize(e.skillDescription, i18n),
  }))
})
const groups = computed<GroupedListGroup[]>(() => {
  return hsrPaths.map(e => ({
    groupKey: e,
    title: tx(i18n, `paths.${e}`),
  }))
})

const spiltByRarity = splitByField(lightCones, "rarity")
const spiltByPath = splitByField(lightCones, "path")

onActivated(() => {
  const specifiedCharaId = route.query.character
  if (typeof specifiedCharaId === "string") { // not undefined and valid
    const queryCharacter = characters.find(e => e.id === toCharacterId(specifiedCharaId))
    if (typeof queryCharacter === "undefined") {
      return
    }

    const variant = (() => {
      if (isCharacterGroup(queryCharacter)) {
        if (!queryCharacter.variants.some(e => e.path === toVariant(specifiedCharaId))) {
          return null
        }
        return toVariant(specifiedCharaId)
      } else {
        return queryCharacter.path
      }
    })()
    const index = spiltByPath.findIndex(e => e[0].path === variant)
    if (index !== -1) {
      expanded.value = [index]
    }
  }
})
</script>

<template>
  <div>
    <v-row
      no-gutters
      style="gap: 8px"
    >
      <v-btn
        :color="filteringRarity.length >= 1 ? 'star' : ''"
        prepend-icon="mdi-filter"
      >
        <span>{{ tx("common.filter") }}</span>

        <client-only>
          <v-menu activator="parent">
            <v-list v-model:selected="filteringRarity">
              <v-list-item
                v-for="g in spiltByRarity"
                :key="g[0].rarity"
                :value="g[0].rarity"
              >
                <v-row no-gutters>
                  <v-icon
                    v-for="i in g[0].rarity"
                    :key="i"
                    color="star"
                    size="18"
                  >
                    mdi-star
                  </v-icon>
                </v-row>
              </v-list-item>
            </v-list>
          </v-menu>
        </client-only>
      </v-btn>

      <v-btn
        :disabled="expanded.length === spiltByPath.length"
        prepend-icon="mdi-expand-all"
        @click="expanded = spiltByPath.map((_, i) => i)"
      >
        {{ tx("common.expandAll") }}
      </v-btn>

      <v-btn
        :disabled="expanded.length === 0"
        prepend-icon="mdi-collapse-all"
        @click="expanded = []"
      >
        {{ tx("common.collapseAll") }}
      </v-btn>
    </v-row>

    <v-checkbox
      v-model="showSkillDescriptions"
      :label="tx('lightConesPage.showSkillDescriptions')"
      density="comfortable"
      hide-details
    />

    <GroupedList
      v-model="expanded"
      :groups="groups"
      :items="groupItems"
      preserve-query
    >
      <template #subtitle="{ item }">
        <v-list-item-subtitle
          v-if="showSkillDescriptions"
          class="mt-1"
        >
          <EmphasizedText :text="item.skillDesc as string" />
        </v-list-item-subtitle>
      </template>
    </GroupedList>
  </div>
</template>

<style lang="sass" scoped />
