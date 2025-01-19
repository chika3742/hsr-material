<script setup lang="ts">
import { computed, ref, useNuxtApp } from "#imports"

type ExpItemDef = {
  itemId: string
  expPerItem: number
}

type BookmarkState = "none" | "partial" | "full"

interface Props {
  /**
   * Material ID. Not required if `isExpItem` is true.
   */
  materialId?: string
  /**
   * A method that returns the material image URL.
   */
  materialImage: (materialId: string) => string
  /**
   * Quantity of the material or exp.
   */
  quantity: number
  /**
   * A method that returns the rarity of the material.
   */
  rarity: (materialId: string) => number
  dimmed?: boolean
  bookmarkButtonLoading?: boolean
  /**
   * If `undefined`, loading indicator will be shown.
   */
  bookmarkState?: BookmarkState | undefined
  initialSelectedExpItemId?: string
  isExpItem?: boolean
  expItemLineup?: ExpItemDef[]
  farmingCount?: (materialId: string, quantity: number) => number | null
}

const props = withDefaults(defineProps<Props>(), {
  materialId: undefined,
  bookmarkState: undefined,
  initialSelectedExpItemId: undefined,
  expItemLineup: () => [],
  farmingCount: undefined,
})

interface Emits {
  (event: "toggle-bookmark", selectedExpItemId: string | undefined): void

  (event: "re-bookmark", selectedExpItemId: string | undefined): void
}

defineEmits<Emits>()

const { $isTouchDevice } = useNuxtApp()

if (props.isExpItem && props.expItemLineup.length === 0) {
  throw new Error("expItemLineup must not be empty")
}

const selectedExpItemIndex = ref(
  Math.max(props.expItemLineup.findIndex(e => e.itemId === props.initialSelectedExpItemId), 0),
)
const forwardSelectedExpItem = () => {
  selectedExpItemIndex.value = (selectedExpItemIndex.value + 1) % props.expItemLineup.length
}

const _materialId = computed(() => {
  return props.isExpItem
    ? props.expItemLineup[selectedExpItemIndex.value].itemId
    : props.materialId!
})

const _quantity = computed(() => {
  return props.isExpItem
    ? Math.ceil(props.quantity / props.expItemLineup[selectedExpItemIndex.value].expPerItem)
    : props.quantity
})

const markerColorCss = computed(() => {
  return `rgb(var(--v-theme-rarity-${props.rarity(_materialId.value)}))`
})

// eslint-disable-next-line vue/return-in-computed-property -- false positive
const bookmarkButtonIcon = computed(() => {
  if (typeof props.bookmarkState === "undefined") {
    return "mdi-bookmark"
  }

  switch (props.bookmarkState) {
    case "none":
      return "mdi-bookmark"
    case "partial":
      return "mdi-bookmark-minus"
    case "full":
      return "mdi-bookmark-check"
  }
})

// eslint-disable-next-line vue/return-in-computed-property -- false positive
const bookmarkButtonIconColor = computed(() => {
  if (typeof props.bookmarkState === "undefined") {
    return undefined
  }

  switch (props.bookmarkState) {
    case "none":
      return undefined
    case "partial":
      return "partially-bookmarked"
    case "full":
      return "bookmarked"
  }
})

const showBookmarkMenu = ref(false)

const farmingCount = computed(() => {
  if (props.farmingCount) {
    return props.farmingCount(_materialId.value, _quantity.value)
  }
  return null
})
</script>

<template>
  <v-card
    v-show="_quantity !== 0"
    :class="dimmed ? 'dimmed' : ''"
    :v-slot:loader="false"
    color="card"
  >
    <div class="d-flex h-100">
      <!-- exp item forward button -->
      <MaterialCardAction
        v-if="isExpItem"
        icon="mdi-swap-horizontal"
        compact
        @click="forwardSelectedExpItem"
      />

      <!-- item & qty info -->
      <v-btn
        variant="text"
        class="flex-shrink-1 h-100 px-2"
        :rounded="0"
        style="gap: 4px"
        :to="localePath(`/materials/${_materialId}`)"
      >
        <div class="d-flex align-center">
          <v-img
            :src="materialImage(_materialId)"
            height="35"
            width="35"
          />
          <span
            v-show="$isTouchDevice"
            class="ml-1 font-kiwi-maru text-wrap flex-shrink-1"
            style="font-size: 1.2em"
          >{{ $t(`materialNames.${_materialId}`) }}</span>
          <span
            class="ml-2 font-cairo"
            style="font-size: 1.5em"
          >×{{ _quantity }}</span>
          <div
            v-if="farmingCount"
            class="pt-4 mr-n2"
            style="opacity: 0.6"
          >
            <v-icon>mdi-tractor</v-icon>
            <span>{{ farmingCount }}</span>
          </div>
        </div>
      </v-btn>

      <!-- bookmark button -->
      <MaterialCardAction
        :icon="bookmarkButtonIcon"
        :icon-color="bookmarkButtonIconColor"
        :loading="bookmarkButtonLoading"
        :disabled="typeof bookmarkState === 'undefined'"
        @click="bookmarkState === 'partial'
          ? showBookmarkMenu = !showBookmarkMenu
          : $emit('toggle-bookmark', isExpItem ? _materialId : undefined)"
      >
        <template #menu>
          <v-menu
            v-model="showBookmarkMenu"
            :open-on-click="false"
            activator="parent"
          >
            <v-list density="comfortable">
              <v-list-item
                lines="two"
                prepend-icon="mdi-bookmark-check"
                :title="$t('bookmark.reBookmark')"
                :subtitle="$t('bookmark.reBookmarkDesc')"
                @click="$emit('re-bookmark', isExpItem ? _materialId : undefined)"
              />
              <v-list-item
                lines="two"
                prepend-icon="mdi-delete"
                :title="$t('bookmark.unBookmark')"
                :subtitle="$t('bookmark.unBookmarkDesc')"
                @click="$emit('toggle-bookmark', isExpItem ? _materialId : undefined)"
              />
            </v-list>
          </v-menu>
        </template>
      </MaterialCardAction>
    </div>

    <div
      class="rarity-marker"
      :style="`border-color: transparent transparent transparent ${markerColorCss}`"
    />

    <client-only>
      <v-tooltip
        :disabled="$isTouchDevice as boolean"
        :open-delay="100"
        activator="parent"
        location="bottom"
      >
        <span class="font-kiwi-maru">{{ $t(`materialNames.${_materialId}`) }}</span>
      </v-tooltip>
    </client-only>
  </v-card>
</template>

<style lang="sass" scoped>
.rarity-marker
  position: absolute
  top: 0
  left: 0
  width: 0
  height: 0
  border-style: solid
  border-width: 0 0 16px 16px
  z-index: 1
  pointer-events: none

.dimmed
  opacity: 0.5
</style>
