<script lang="ts" setup>
import relicSets from "assets/data/relic-sets.csv"
import type {RelicSet} from "~/types/data/relics"

interface Props {
  modelValue: boolean
  currentSetId: string
}

const props = defineProps<Props>()

defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "okPressed", value: RelicSet): void
}>()

const selectedItem = ref<RelicSet[]>([])

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    selectedItem.value = []
  }
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card :title="tx('relicDetailsPage.chooseRelicSet')">
      <template #text>
        <v-list v-model:selected="selectedItem" mandatory>
          <v-list-item
            v-for="item in relicSets.filter(e => e.id !== currentSetId && e.type === 'cavern')"
            :key="item.id"
            :prepend-avatar="getRelicSetImage(item.id)"
            :title="tx(`relicSetTitles.${item.id}`)"
            :value="item"
            color="primary"
          >
            <RelicSetEffects :relic-id="item.id" show2pc-only style="font-size: 0.9em; margin-top: 2px" />
          </v-list-item>
        </v-list>
      </template>

      <template #actions>
        <v-spacer />
        <v-btn :text="tx('common.cancel')" variant="text" @click="$emit('update:modelValue', false)" />
        <v-btn
          :disabled="selectedItem.length === 0"
          :text="tx('common.ok')"
          variant="text"
          @click="$emit('update:modelValue', false); $emit('okPressed', selectedItem[0])"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="sass" scoped>

</style>
