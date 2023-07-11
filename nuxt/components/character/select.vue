<script lang="ts" setup>
import {RouteLocationRaw} from "vue-router"
import {CharacterIdWithVariant} from "~/types/strings"
import characters from "~/assets/data/characters.yaml"
import {Character, Path} from "~/types/generated/characters.g"

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

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void
  (e: "update:error", value: string): void
}>()

const i18n = useI18n()
const route = useRoute()

interface VSelectCharacter extends Omit<Character, "variants"> {
  variant?: Path | undefined
  idWithVariant: CharacterIdWithVariant
  route: RouteLocationRaw
  title: string
}

const vSelectCharacters = (() => {
  const result: VSelectCharacter[] = []

  for (const character of characters) {
    if (character.variants) {
      for (const variant of character.variants) {
        const newObj = {...character}
        delete newObj.variants

        result.push({
          ...newObj,
          title: tx(i18n, `characterNames.${newObj.id}_${variant.path}`),
          variant: variant.path,
          idWithVariant: `${newObj.id}_${variant.path}`,
          route: {path: `/characters/${newObj.id}`, query: {variant: variant.path}},
          materials: variant.materials,
        })
      }
    } else {
      result.push({
        ...character,
        title: tx(i18n, `characterNames.${character.id}`),
        idWithVariant: character.id,
        route: {path: `/characters/${character.id}`},
      })
    }
  }

  return result
})()

onMounted(() => {
  const character = vSelectCharacters.find(e => e.idWithVariant === route.query.character)
  if (character) {
    emit("update:modelValue", character.idWithVariant)
  } else {
    emit("update:modelValue", vSelectCharacters[0].idWithVariant)
  }
})

</script>

<template>
  <client-only>
    <v-select
      :chips="multiple"
      :error-messages="error"
      :items="vSelectCharacters"
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
