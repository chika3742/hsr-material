<script lang="ts" setup>
import {RelicSet} from "~/types/data/relics"
import relicStats from "assets/data/relic-stats.yaml"
import {Stat} from "~/types/generated/relic-stats.g"

interface Props {
  modelValue: boolean
  relicSets: RelicSet[]
}

interface RadioGroup {
  type: string
  title: string
  items: Stat[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const setType = computed<"4pcs" | "2pcs">(() => {
  switch (props.relicSets.length) {
    case 1:
      if (props.relicSets[0].type === "cavern") {
        return "4pcs"
      } else {
        return "2pcs"
      }
    case 2:
      return "2pcs"
    default:
      throw new Error("Invalid relic set count")
  }
})

const radioGroups = computed<RadioGroup[]>(() => {
  if (props.relicSets.length === 0 || props.relicSets.length >= 3) {
    throw new Error("Invalid relic set count")
  }

  if (props.relicSets[0].type === "cavern") {
    return [
      {
        type: "body",
        title: "relicDetailsPage.mainStatBody",
        items: relicStats.main.body,
      },
      {
        type: "feet",
        title: "relicDetailsPage.mainStatFeet",
        items: relicStats.main.feet,
      },
    ]
  } else {
    return [
      {
        type: "planarSphere",
        title: "relicDetailsPage.mainStatPlanarSphere",
        items: relicStats.main.planarSphere,
      },
      {
        type: "linkRope",
        title: "relicDetailsPage.mainStatLinkRope",
        items: relicStats.main.linkRope,
      },
    ]
  }
})

const selectedStats = ref({
  main: {} as Record<string, Stat | null>,
  sub: [] as Stat[],
})

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    selectedStats.value = {
      main: Object.fromEntries(radioGroups.value.map(e => [e.type, null])),
      sub: [] as Stat[],
    }
  }
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    :fullscreen="$vuetify.display.xs"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card :title="tx('relicDetailsPage.bookmarkRelicSet')">
      <template #text>
        <div>
          <!-- Relic set view -->
          <v-list-item
            v-for="set in relicSets"
            :key="set.id"
            :prepend-avatar="getRelicSetImage(set.id)"
            :title="tx(`relicSetTitles.${set.id}`) + ' (' + tx(`relicDetailsPage.${setType}`) + ')'"
          />

          <section v-for="group in radioGroups" :key="group.title">
            <h4>{{ tx(group.title) }}</h4>
            <v-radio-group v-model="selectedStats.main[group.type]" inline>
              <v-radio :label="tx('relicDetailsPage.unspecified')" :value="null" />
              <v-radio v-for="stat in group.items" :key="stat" :label="tx(`stats.${stat}`)" :value="stat" />
            </v-radio-group>
          </section>

          <section>
            <h4>{{ tx("common.subStat") }}</h4>
            <v-row no-gutters>
              <v-checkbox-btn
                v-for="stat in relicStats.sub"
                :key="stat"
                v-model="selectedStats.sub"
                :label="tx(`stats.${stat}`)"
                :value="stat"
                inline
              />
            </v-row>
          </section>
        </div>
      </template>

      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          {{ tx("common.cancel") }}
        </v-btn>
        <v-btn variant="text" @click="$emit('update:modelValue', false); console.log(selectedStats)">
          {{ tx("common.ok") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="sass" scoped>

</style>
