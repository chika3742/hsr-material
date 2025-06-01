<template>
  <v-fade-transition>
    <div
      v-show="!mounted"
      class="loading-overlay"
    />
  </v-fade-transition>
</template>

<script setup lang="ts">
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped lang="sass">
.loading-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 2000
  backdrop-filter: blur(4px) brightness(0.5)
  --webkit-backdrop-filter: blur(4px) brightness(0.5)

  &::after
    // loading indicator
    content: ""
    position: absolute
    top: 50%
    left: 50%
    width: 100px
    height: 100px
    margin-top: -50px
    margin-left: -50px
    border-radius: 50%
    border: 10px solid rgba(255, 255, 255, 0.2)
    border-top-color: #fff
    animation: spin 1s linear infinite

    @keyframes spin
      from
        transform: rotate(0deg)
      to
        transform: rotate(360deg)
</style>
