<script setup lang="ts">
import { definePageMeta, ref, watch } from "#imports"

definePageMeta({
  title: "MaterialCard",
})

const expItemLineup = [
  {
    itemId: "expItem1",
    expPerItem: 100,
    rarity: 3,
  },
  {
    itemId: "expItem2",
    expPerItem: 1000,
    rarity: 4,
  },
  {
    itemId: "expItem3",
    expPerItem: 5000,
    rarity: 5,
  },
]

const loading = ref(false)

watch(loading, (_loading) => {
  if (_loading) {
    setTimeout(() => {
      loading.value = false
    }, 3000)
  }
})
</script>

<template>
  <div
    class="d-flex flex-wrap"
    style="gap: 16px"
  >
    <MaterialCard
      material-id="test"
      :material-image="() => '/_nuxt/assets/img/test_small.webp'"
      bookmark-state="none"
      :quantity="100"
      :rarity="() => 3"
      @toggle-bookmark="() => { console.log('toggle-bookmark') }"
      @re-bookmark="() => { console.log('re-bookmark') }"
    />

    <MaterialCard
      :material-image="() => '/_nuxt/assets/img/test_small.webp'"
      :quantity="5000"
      :rarity="(materialId) => expItemLineup.find(e => e.itemId === materialId)?.rarity ?? 3"
      bookmark-state="partial"
      :exp-item-lineup="expItemLineup"
      is-exp-item
      @toggle-bookmark="(selectedExpItemId) => { console.log('toggle-bookmark', selectedExpItemId) }"
      @re-bookmark="(selectedExpItemId) => { console.log('re-bookmark', selectedExpItemId) }"
    />

    <MaterialCard
      material-id="test"
      :material-image="() => '/_nuxt/assets/img/test_small.webp'"
      :quantity="9000"
      :rarity="() => 5"
      bookmark-state="full"
      :farming-count="() => 5"
      @toggle-bookmark="(selectedExpItemId) => { console.log('toggle-bookmark', selectedExpItemId) }"
      @re-bookmark="() => { console.log('re-bookmark') }"
    />

    <MaterialCard
      is-exp-item
      :exp-item-lineup="expItemLineup"
      :material-image="() => '/_nuxt/assets/img/test_small.webp'"
      :quantity="9000"
      :rarity="(materialId) => expItemLineup.find(e => e.itemId === materialId)?.rarity ?? 3"
      bookmark-state="none"
      initial-selected-exp-item-id="expItem2"
      :bookmark-button-loading="loading"
      @toggle-bookmark="loading = true"
    />

    <MaterialCard
      is-exp-item
      :exp-item-lineup="expItemLineup"
      :material-image="() => '/_nuxt/assets/img/test_small.webp'"
      :quantity="9000"
      :rarity="(materialId) => expItemLineup.find(e => e.itemId === materialId)?.rarity ?? 3"
      initial-selected-exp-item-id="expItem2"
    />
  </div>
</template>

<style scoped>

</style>
