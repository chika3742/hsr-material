<template>
  <v-card :to="localePath(`/materials/${materialId}`)" :v-slot:loader="false" color="card">
    <div class="py-2 px-3 d-flex align-center">
      <v-btn
        v-if="items[0].purposeType === 'exp'"
        color="transparent"
        class="my-n2 ml-n3"
        flat
        icon="mdi-swap-horizontal"
        size="small"
        @click.prevent="forwardSelectedExpItem"
      />
      <v-img :src="getMaterialImage(materialId)" height="30" width="30" />
      <span class="ml-2 font-cairo" style="font-size: 1.2em">×{{ quantity }}</span>
    </div>

    <!-- avoid node mismatch error -->
    <client-only>
      <v-tooltip :open-delay="100" activator="parent" location="bottom">
        <span class="font-kiwi-maru">{{ $t(`materialNames.${materialId}`) }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<script lang="ts" setup>
import {BookmarkableExp, BookmarkableIngredient, BookmarkableItem} from "~/types/bookmarkable-ingredient"
import {computed} from "#imports"
import characterIngredients from "~/assets/data/character-ingredients.yaml"

const props = defineProps<{
  items: BookmarkableItem[]
}>()

const expDefs = computed(() => {
  switch (props.items[0].targetType) {
    case "character":
      return characterIngredients.exp
  }
})

const selectedExpItem = ref(expDefs.value[0])

const forwardSelectedExpItem = () => {
  const index = expDefs.value.findIndex(e => e.itemId === selectedExpItem.value.itemId)
  selectedExpItem.value = expDefs.value[index + 1] ?? expDefs.value[0]
}

const materialId = computed(() => {
  if (isExpList(props.items)) {
    return selectedExpItem.value.itemId
  } else {
    return (props.items[0] as BookmarkableIngredient).id
  }
})

const quantity = computed(() => {
  if (isExpList(props.items)) {
    return props.items.reduce((acc, e) => acc + Math.ceil(e.exp! / selectedExpItem.value.expPerItem), 0)
  } else {
    return (props.items as BookmarkableIngredient[]).reduce((acc, e) => acc + e.quantity!, 0)
  }
})

const isExpList = (e: BookmarkableItem[]): e is BookmarkableExp[] => {
  return e.every(e => e.purposeType === "exp")
}
</script>
