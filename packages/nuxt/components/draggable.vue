<script lang="ts" setup>
import Sortable from "sortablejs"

interface Props {
  containerClass?: string
}
defineProps<Props>()

interface Emits {
  (e: "sort", ev: Sortable.SortableEvent): void
}

const emit = defineEmits<Emits>()

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  Sortable.create(container.value!, {
    animation: 200,
    handle: ".sortable-handle",
    ghostClass: "sortable-ghost",
    scroll: true,
    scrollSensitivity: 60,
    forceFallback: true,
    onSort(ev) {
      emit("sort", ev)
    },
  })
})
</script>

<template>
  <div
    ref="container"
    :class="containerClass"
  >
    <slot />
  </div>
</template>

<style lang="sass">
.sortable-ghost
  opacity: 0.6
</style>
