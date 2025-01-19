<!-- suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
  title: "Colors",
})
</script>

<template>
  <ul>
    <li style="background: rgb(var(--v-theme-primary))">
      primary
    </li>
    <li style="background: rgb(var(--v-theme-inverse-primary))">
      inverse-primary
    </li>
  </ul>
</template>

<style lang="sass" scoped>
ul
  list-style: none

  li
    padding: 8px
</style>
