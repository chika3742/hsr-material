<script lang="ts" setup>
import {CharacterIdWithVariant} from "~/types/strings"

interface Props {
  modelValue: CharacterIdWithVariant | CharacterIdWithVariant[]
  maxWidth?: string
  error?: string
  multiple?: boolean
}

withDefaults(defineProps<Props>(), {
  maxWidth: "unset",
  error: "",
  multiple: false,
})

defineEmits<{
  (e: "update:modelValue", value: string | string[]): void
  (e: "update:error", value: string): void
}>()

</script>

<template>
  <client-only>
    <v-select
      :chips="multiple"
      :error-messages="error"
      :items="$vSelectCharacters"
      :label="tx('relicDetailsPage.characterToEquip')"
      :model-value="modelValue"
      :multiple="multiple as any"
      :style="{'max-width': maxWidth}"
      class="mt-2"
      item-value="idWithVariant"
      @blur="$emit('update:error', '')"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #item="{props: _props, item}">
        <v-list-item :title="item.title" v-bind="_props">
          <template #prepend="{isSelected}">
            <div class="d-flex align-center mr-2">
              <v-checkbox-btn v-if="multiple" :model-value="isSelected" :ripple="false" />
              <v-img :src="getCharacterImage(item.raw.id, 'small')" width="40" />
            </div>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </client-only>
</template>

<style lang="sass" scoped>

</style>
