<script lang="ts" setup>
import relics from "assets/data/relic-sets.csv"

definePageMeta({
  title: "relics",
})

const openedPanels = ref<string[]>([])
const showCavernRelics = ref(true)
const showPlanarOrnaments = ref(true)

const _relics = computed(() => {
  return [
    ...relics.filter(e => e.type === "cavern" && showCavernRelics.value),
    ...relics.filter(e => e.type === "planar" && showPlanarOrnaments.value),
  ]
})
</script>

<template>
  <div class="d-flex flex-column" style="gap: 16px">
    <v-row align="center" no-gutters style="column-gap: 16px; row-gap: 4px">
      <v-btn
        :text="tx('common.expandAll')"
        prepend-icon="mdi-expand-all"
        @click="openedPanels = _relics.map(e => e.id)"
      />
      <v-btn :text="tx('common.collapseAll')" prepend-icon="mdi-collapse-all" @click="openedPanels = []" />
      <v-checkbox
        v-model="showCavernRelics"
        :label="tx('relicTypes.cavern')"
        class="flex-grow-0"
        density="compact"
        hide-details
      />
      <v-checkbox
        v-model="showPlanarOrnaments"
        :label="tx('relicTypes.planar')"
        class="flex-grow-0"
        density="compact"
        hide-details
      />
    </v-row>

    <v-expansion-panels v-model="openedPanels" multiple>
      <v-expansion-panel v-for="relic in _relics" :key="relic.id" :value="relic.id">
        <v-expansion-panel-title>
          <v-row align="center" class="my-n2" no-gutters style="gap: 8px">
            <v-img :src="getRelicSetImage(relic.id)" aspect-ratio="1" max-width="35px" width="35px" />
            <span>{{ tx(`relicSetTitles.${relic.id}`) }}</span>
            <v-fade-transition>
              <v-btn
                v-show="!openedPanels.includes(relic.id)"
                :to="localePath({path: `/relics/${relic.id}`, query: $route.query})"
                icon="mdi-loupe"
                size="small"
                variant="text"
                @click.stop
              />
            </v-fade-transition>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div>
            <RelicSetEffects :relic-id="relic.id" />
            <v-btn
              :to="{path: `/relics/${relic.id}`, query: $route.query}"
              class="mt-2"
              color="primary"
              prepend-icon="mdi-loupe"
              :text="tx('relicsPage.toDetailPage')"
              variant="text"
            />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style lang="sass" scoped>

</style>
