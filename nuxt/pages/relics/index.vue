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
        :label="tx('common.cavernRelics')"
        class="flex-grow-0"
        density="compact"
        hide-details
      />
      <v-checkbox
        v-model="showPlanarOrnaments"
        :label="tx('common.planarOrnaments')"
        class="flex-grow-0"
        density="compact"
        hide-details
      />
    </v-row>

    <v-expansion-panels v-model="openedPanels" multiple>
      <v-expansion-panel v-for="relic in _relics" :key="relic.id" :value="relic.id">
        <v-expansion-panel-title>
          <v-row align="center" class="my-n2" no-gutters style="gap: 8px">
            <v-img :src="getRelicSetImage(relic.id)" aspect-ratio="1" max-width="35px" />
            <span>{{ tx(`relicSetTitles.${relic.id}`) }}</span>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div>
            <section>
              <h4>{{ tx("common.2pcEffect") }}</h4>
              <EmphasizedText :text="tx(`relicSetEffects.${relic.id}.2pc`)" class="pl-4 my-1" />
            </section>
            <section v-if="$te(`relicSetEffects.${relic.id}.4pc`)">
              <h4>{{ tx("common.4pcEffect") }}</h4>
              <EmphasizedText :text="tx(`relicSetEffects.${relic.id}.4pc`)" class="pl-4 my-1" />
            </section>
            <v-btn class="mt-2" color="primary" text="詳細ページへ" variant="tonal" />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style lang="sass" scoped>
h4
  color: rgb(var(--v-theme-surface-variant))
  font-weight: normal
  font-size: 0.9em
</style>
