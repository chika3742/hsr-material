<script setup lang="ts">
type BookmarkState = "none" | "partial" | "full"

interface Props {
  /**
   * Name of the material.
   */
  name: string
  /**
   * Link destination when the material is clicked.
   */
  to: string
  imagePath: string
  /**
   * Quantity of the material or exp.
   */
  quantity: number
  /**
   * Rarity of the material.
   */
  rarity: number
  /**
   * Determines whether the card should appear dimmed.
   * When set to true, the card will display with reduced opacity,
   * typically used to indicate a disabled or inactive state.
   *
   * @default false
   */
  dimmed?: boolean
  /**
   * When true, a loading indicator will be shown on the bookmark button.
   *
   * @default false
   */
  loading?: boolean
  bookmarkState?: BookmarkState
  /**
   * Shows a toggle button before the item. Typically used for exp items.
   *
   * @default false
   */
  showItemToggleButton?: boolean
  farmingCount?: number | null
  farmingCountDivideBy?: number
}

const props = withDefaults(defineProps<Props>(), {
  dimmed: false,
  loading: false,
  showItemToggleButton: false,
  bookmarkState: "none",
  farmingCount: null,
})

interface Emits {
  (event: "toggle-bookmark"): void
  (event: "re-bookmark"): void
  (event: "toggle-item"): void
}

defineEmits<Emits>()

const { $isTouchDevice } = useNuxtApp()

const markerColorCss = computed(() => {
  return `rgb(var(--v-theme-rarity-${props.rarity}))`
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
    return props.farmingCount
  }
  return null
})
</script>

<template>
  <v-card
    :class="dimmed ? 'dimmed' : ''"
    :v-slot:loader="false"
    color="card"
  >
    <div class="d-flex h-100">
      <!-- exp item forward button -->
      <MaterialCardAction
        v-if="showItemToggleButton"
        icon="mdi-swap-horizontal"
        compact
        @click="$emit('toggle-item')"
      />

      <!-- item & qty info -->
      <v-btn
        variant="text"
        class="flex-shrink-1 h-100 px-2"
        :rounded="0"
        style="gap: 4px"
        :to="to"
      >
        <div class="d-flex align-center">
          <v-img
            :src="imagePath"
            height="35"
            width="35"
          />
          <span
            v-show="$isTouchDevice"
            class="ml-1 font-kiwi-maru text-wrap flex-shrink-1"
            style="font-size: 1.2em"
          >{{ name }}</span>
          <span
            class="ml-2 font-cairo"
            style="font-size: 1.5em"
          >×{{ quantity }}</span>
          <div
            v-if="farmingCount"
            class="pt-4 mr-n2"
            style="opacity: 0.6"
          >
            <v-icon>mdi-tractor</v-icon>
            <span>{{ Math.ceil(farmingCount / (farmingCountDivideBy ?? 1)) }}</span>
            <span
              v-if="farmingCountDivideBy"
              style="font-size: 0.7em;"
            >×{{ farmingCountDivideBy }}</span>
          </div>
        </div>
      </v-btn>

      <!-- bookmark button -->
      <MaterialCardAction
        :icon="bookmarkButtonIcon"
        :icon-color="bookmarkButtonIconColor"
        :loading="loading"
        :disabled="typeof bookmarkState === 'undefined'"
        @click="bookmarkState === 'partial'
          ? showBookmarkMenu = !showBookmarkMenu
          : $emit('toggle-bookmark')"
      >
        <template #menu>
          <v-menu
            v-if="bookmarkState === 'partial'"
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
                @click="$emit('re-bookmark')"
              />
              <v-list-item
                lines="two"
                prepend-icon="mdi-delete"
                :title="$t('bookmark.unBookmark')"
                :subtitle="$t('bookmark.unBookmarkDesc')"
                @click="$emit('toggle-bookmark')"
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
        <span class="font-kiwi-maru">{{ name }}</span>
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
