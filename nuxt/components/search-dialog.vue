<script lang="ts" setup>
import {AlgoliaRecord} from "~/types/algolia-record"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  },
})

const {$algoliaClient} = useNuxtApp()
const i18n = useI18n()

const loading = ref(false)
const query = ref("")
const error = ref("")
const results = ref<AlgoliaRecord[] | null>(null)
const cachedResults = ref<Record<string, AlgoliaRecord[]>>({})

const executeQuery = async(_query: string) => {
  loading.value = true

  try {
    const result = await $algoliaClient.search<AlgoliaRecord>(_query)
    results.value = result.hits
    cachedResults.value[_query] = result.hits
  } catch (e) {
    console.error(e)
    results.value = null
    error.value = tx(i18n, "errors.failedToSearch")
  } finally {
    loading.value = false
  }
}

watch(query, (value) => {
  error.value = ""

  if (value === "" || !value) {
    results.value = null
    return
  }

  if (value.match(/[\uFF21-\uFF3A\uFF41-\uFF5A]/)) {
    return
  }

  if (cachedResults.value[value]) {
    results.value = cachedResults.value[value]
    return
  }

  executeQuery(value)
})

const clearQuery = () => {
  query.value = ""
  results.value = null
}

const closeDialog = () => {
  emit("update:modelValue", false)
}

const getItemImage = (item: AlgoliaRecord): string => {
  switch (item.recordType) {
    case "character":
      return getCharacterImage(item.itemId, "small")
    case "light-cone":
      return getLightConeImage(item.itemId)
    case "material":
      return getMaterialImage(item.itemId)
  }
}
</script>

<template>
  <client-only>
    <v-dialog
      v-model="isOpen"
      :fullscreen="$vuetify.display.xs"
      :max-width="$vuetify.display.xs ? '' : '550px'"
      height="100%"
    >
      <v-card height="100%">
        <div class="h-100 d-flex flex-column">
          <v-row class="flex-grow-0 mx-4 mt-4" no-gutters style="gap: 8px">
            <v-text-field
              v-model="query"
              :error-messages="error"
              :label="tx('common.search')"
              autofocus
              clearable
              hint="Powered by Algolia"
              persistent-hint
              prepend-inner-icon="mdi-magnify"
            />

            <v-btn v-if="$vuetify.display.xs" density="comfortable" icon="mdi-close" @click="closeDialog" />
          </v-row>

          <v-progress-linear :active="loading" color="primary" indeterminate />

          <div v-if="results && results.length === 0">
            <v-card-text class="text-center">
              <v-icon size="64">
                mdi-alert-circle-outline
              </v-icon>
              <p class="mt-2">
                {{ tx("errors.noSearchResults") }}
              </p>
            </v-card-text>
          </div>

          <v-list v-if="results" style="overflow: auto !important">
            <v-list-item
              v-for="item in results"
              :key="item.objectID"
              :prepend-avatar="getItemImage(item)"
              :subtitle="tx(`searchRecordTypes.${item.recordType}`)"
              :title="tx(item.i18nKey)"
              :to="localePath(item.url)"
              @click="clearQuery(); closeDialog()"
            />
          </v-list>
        </div>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<style lang="sass" scoped>

</style>
