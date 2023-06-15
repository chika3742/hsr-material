<template>
  <v-card v-show="quantity !== 0" :to="localePath(`/materials/${materialId}`)" :v-slot:loader="false" color="card">
    <div class="py-2 px-3 d-flex align-center">
      <v-btn
        v-if="items[0].purposeType === 'exp'"
        color="transparent"
        class="my-n2 ml-n3"
        variant="flat"
        icon="mdi-swap-horizontal"
        size="small"
        @click.prevent="forwardSelectedExpItem"
      />
      <v-img :src="getMaterialImage(materialId)" height="30" width="30" />
      <span
        v-show="$isTouchDevice"
        class="ml-1 font-kiwi-maru"
      >{{ tx(`materialNames.${materialId}`) }}</span>
      <span class="ml-2 font-cairo" style="font-size: 1.2em">×{{ quantity }}</span>
    </div>

    <div class="corner-marker" />

    <!-- avoid node mismatch error -->
    <client-only>
      <v-tooltip :disabled="$isTouchDevice" :open-delay="100" activator="parent" location="bottom">
        <span class="font-kiwi-maru">{{ $t(`materialNames.${materialId}`) }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<script lang="ts" setup>
import {useTheme} from "vuetify"
import {BookmarkableExp, BookmarkableIngredient, BookmarkableItem} from "~/types/bookmarkable-ingredient"
import {computed} from "#imports"
import characterIngredients from "~/assets/data/character-ingredients.yaml"
import materials from "~/assets/data/materials.csv"
import lightConeIngredients from "~/assets/data/light-cone-ingredients.yaml"

const props = defineProps<{
  items: BookmarkableItem[]
}>()

const theme = useTheme()

const expDefs = computed(() => {
  switch (props.items[0].targetType) {
    case "character":
      return characterIngredients.expItems
    case "light_cone":
      return lightConeIngredients.expItems
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

const markerColor = computed(() => {
  switch (materials.find(e => e.id === materialId.value)?.rarity) {
    case 5:
      return theme.current.value.colors.rank5
    case 4:
      return theme.current.value.colors.rank4
    case 3:
      return theme.current.value.colors.rank3
    case 2:
      return theme.current.value.colors.rank2
    default:
      return theme.current.value.colors.card
  }
})

const isExpList = (src: BookmarkableItem[]): src is BookmarkableExp[] => {
  return src.every(e => e.purposeType === "exp")
}
</script>

<style lang="sass" scoped>
.corner-marker
  position: absolute
  top: 0
  left: 0
  width: 0
  height: 0
  border-style: solid
  border-width: 0 0 16px 16px
  border-color: transparent transparent transparent v-bind(markerColor)
  z-index: 1
</style>
