<script setup lang="ts">
interface Props {
  height?: string
  icon: string
  iconColor?: string | undefined
  compact?: boolean
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  height: "50px",
  iconColor: undefined,
})

interface Emits {
  (event: "click"): void
}

defineEmits<Emits>()
</script>

<template>
  <div
    v-ripple
    class="material-card-action-container d-flex align-center justify-center position-relative"
    :class="{ compact, loading, disabled }"
    @click="$emit('click')"
  >
    <v-fade-transition leave-absolute>
      <v-icon
        v-if="!loading"
        :color="iconColor"
        size="small"
      >
        {{ icon }}
      </v-icon>

      <!-- loading indicator -->
      <v-progress-circular
        v-else
        indeterminate
        size="small"
        color="primary"
        width="3"
      />
    </v-fade-transition>

    <slot name="menu" />

    <div
      class="hover-overlay"
    />
  </div>
</template>

<style scoped lang="sass">
.material-card-action-container
  height: 100%
  min-height: v-bind(height)
  min-width: 40px
  width: auto
  padding: 0 8px
  &.compact
    width: 35px
    min-width: 35px

  &.loading, &.disabled
    pointer-events: none

  &.disabled
    opacity: 0.5

.hover-overlay
  background-color: currentColor
  position: absolute
  width: 100%
  height: 100%
  opacity: 0
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)
  &:hover
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))
</style>
