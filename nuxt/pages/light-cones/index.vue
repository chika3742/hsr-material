<script lang="ts" setup>
import GroupedList from "~/components/grouped-list.vue"
import lightCones from "~/assets/data/light-cones.yaml"

definePageMeta({
  title: "lightCones",
})

const filteringRarity = ref<number[]>([])
const expanded = ref<number[]>([])

const items = computed(() => {
  return lightCones.filter(e => filteringRarity.value.length === 0 || e.rarity === filteringRarity.value[0]).sort((a, b) => b.rarity - a.rarity)
})

const spiltByRarity = splitByField(lightCones, "rarity")
const spiltByPath = splitByField(lightCones, "path")
</script>

<template>
  <div>
    <v-row no-gutters style="gap: 8px">
      <v-btn :color="filteringRarity.length >= 1 ? 'star' : ''" prepend-icon="mdi-filter">
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
                  <v-icon v-for="i in g[0].rarity" :key="i" color="star" size="18">
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

      <v-btn :disabled="expanded.length === 0" prepend-icon="mdi-collapse-all" @click="expanded = []">
        {{ tx("common.collapseAll") }}
      </v-btn>
    </v-row>

    <GroupedList
      v-model="expanded"
      :image-func="getLightConeImage"
      :items="items"
      category-field="path"
      category-i18n-key="paths"
      class="mt-4"
      item-i18n-key="lightConeNames"
      link-base-path="/light-cones"
    >
      <template #subtitle="{itemId}">
        <v-list-item-subtitle class="mt-1">
          <LightConeSkillDescriptions :light-cone-id="itemId" />
        </v-list-item-subtitle>
      </template>
    </GroupedList>
  </div>
</template>

<style lang="sass" scoped />
