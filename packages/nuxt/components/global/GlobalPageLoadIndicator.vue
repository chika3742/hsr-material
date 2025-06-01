<template>
  <div
    class="position-fixed"
    style="top: 64px; width: 100%; z-index: 1005"
  >
    <v-progress-linear
      :active="isLoadingPage"
      color="primary"
      indeterminate
    />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const isLoadingPage = ref(false)

router.beforeEach(() => {
  isLoadingPage.value = true
})

router.afterEach(() => {
  isLoadingPage.value = false
})
</script>
