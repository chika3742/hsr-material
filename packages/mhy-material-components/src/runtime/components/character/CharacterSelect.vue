<script lang="ts" setup>
import { computed, onMounted, ref, useI18n, useRoute } from "#imports"

interface Props {
  modelValue: string | undefined
  label?: string
  characters: { id: string, image: string }[]
  maxWidth?: string
  error?: string
  filter?: (id: string) => boolean
  filterDisableCheckboxText?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  maxWidth: "unset",
  error: "",
  filter: undefined,
  filterDisableCheckboxText: "",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "update:error", value: string): void
}>()

const i18n = useI18n()
const route = useRoute()

const isFilterDisabled = ref(false)

const vSelectItems = computed(() => {
  let characters = props.characters

  if (props.filter && !isFilterDisabled.value) {
    characters = characters.filter(e => props.filter?.(e.id))
  }

  return characters.map(character => ({
    title: i18n.t(`characterNames.${character.id}`),
    value: character.id,
    image: character.image,
  }))
})

const toggleFilterDisabled = () => {
  isFilterDisabled.value = !isFilterDisabled.value

  if (props.modelValue && !vSelectItems.value.some(({ value: id }) => props.modelValue === id)) {
    emit("update:modelValue", vSelectItems.value[0].value)
  }
}

onMounted(() => {
  const filteredCharacters = (() => {
    if (props.filter) {
      return props.characters.filter(e => props.filter!(e.id))
    } else {
      return props.characters
    }
  })()

  const initialCharacter = props.characters.find(e => e.id === route.query.character)

  if (initialCharacter) {
    // if the initial character is not in the filtered list, disable the filter
    if (!filteredCharacters.some(e => e.id === initialCharacter.id)) {
      isFilterDisabled.value = true
    }
    emit("update:modelValue", initialCharacter.id)
  } else {
    emit("update:modelValue", filteredCharacters[0].id)
  }
})
</script>

<template>
  <v-select
    :error-messages="error"
    :items="vSelectItems"
    :label="label"
    :model-value="modelValue"
    :style="{ 'max-width': maxWidth }"
    class="mt-2"
    @blur="$emit('update:error', '')"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #item="{ props: _props, item }">
      <v-list-item
        :title="item.title"
        v-bind="_props"
      >
        <template #prepend>
          <div class="d-flex align-center mr-2">
            <v-img
              :src="item.raw.image"
              aspect-ratio="1"
              width="40"
            />
          </div>
        </template>
      </v-list-item>
    </template>

    <template
      v-if="filter"
      #append-item
    >
      <v-divider class="mb-2" />
      <v-list-item
        :title="filterDisableCheckboxText"
        density="compact"
        @click="toggleFilterDisabled"
      >
        <template #prepend>
          <v-checkbox-btn
            :model-value="isFilterDisabled"
            density="compact"
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="sass" scoped>

</style>
