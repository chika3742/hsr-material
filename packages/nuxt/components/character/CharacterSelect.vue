<script lang="ts" setup>
interface Props {
  modelValue: string | undefined
  label?: string
  characters: { id: string, name: string, image: string }[]
  maxWidth?: string
  error?: string
  filter?: (id: string) => boolean
  filterDisableCheckboxText?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  maxWidth: "unset",
  error: "",
  filterDisableCheckboxText: "",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "update:error", value: string): void
}>()

const route = useRoute()

const isFilterDisabled = ref(false)

const vSelectItems = computed(() => {
  let characters = props.characters

  if (props.filter && !isFilterDisabled.value) {
    characters = characters.filter(e => props.filter?.(e.id))
  }

  return characters
})

const toggleFilterDisabled = () => {
  isFilterDisabled.value = !isFilterDisabled.value

  if (props.modelValue && !vSelectItems.value.some(({ id }) => props.modelValue === id)) {
    const firstItem = vSelectItems.value[0]
    if (firstItem) {
      emit("update:modelValue", firstItem.id)
    }
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
    const firstFiltered = filteredCharacters[0]
    if (firstFiltered) {
      emit("update:modelValue", firstFiltered.id)
    }
  }
})
</script>

<template>
  <v-select
    :error-messages="error"
    :items="vSelectItems"
    :label="label"
    :model-value="modelValue"
    item-value="id"
    item-title="name"
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
