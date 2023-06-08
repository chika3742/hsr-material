<script lang="ts" setup>
import {RelicSet} from "~/types/data/relics"
import {Stat} from "~/types/strings"

interface Props {
  modelValue: boolean
  relicSets: RelicSet[]
}

interface RadioGroup {
  id: string
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
        id: "mainBody",
        title: "relicDetailsPage.mainStatBody",
        items: [
          "hp_percent",
          "atk_percent",
          "def_percent",
          "crit_rate",
          "crit_dmg",
          "outgoing_healing",
          "effect_hit_rate",
        ],
      },
      {
        id: "mainFeet",
        title: "relicDetailsPage.mainStatFeet",
        items: [
          "hp_percent",
          "atk_percent",
          "def_percent",
          "speed",
        ],
      },
    ]
  } else {
    return [
      {
        id: "mainPlanarSphere",
        title: "relicDetailsPage.mainStatPlanarSphere",
        items: [
          "hp_percent",
          "atk_percent",
          "def_percent",
          "crit_rate",
          "crit_dmg",
          "outgoing_healing",
          "effect_hit_rate",
        ],
      },
      {
        id: "mainLinkRope",
        title: "relicDetailsPage.mainStatLinkRope",
        items: [
          "hp_percent",
          "atk_percent",
          "def_percent",
          "break_effect",
          "energy_regen_rate",
        ],
      },
    ]
  }
})

const selectedStats = ref<{ sub: Stat[] } | Record<string, Stat>>({
  sub: [] as Stat[],
})

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    selectedStats.value = {
      ...Object.fromEntries(radioGroups.value.map(e => [e.id, null])),
      sub: [] as Stat[],
    }
  }
})

const subStats: Stat[] = [
  "hp",
  "atk",
  "def",
  "hp_percent",
  "atk_percent",
  "def_percent",
  "crit_rate",
  "crit_dmg",
  "effect_hit_rate",
  "effect_res",
  "break_effect",
  "speed",
]
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
            <v-radio-group v-model="selectedStats[group.id]" inline>
              <v-radio :label="tx('relicDetailsPage.unspecified')" :value="null" />
              <v-radio v-for="stat in group.items" :key="stat" :label="tx(`stats.${stat}`)" :value="stat" />
            </v-radio-group>
          </section>

          <section>
            <h4>{{ tx("common.subStat") }}</h4>
            <v-row no-gutters>
              <v-checkbox-btn
                v-for="stat in subStats"
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
