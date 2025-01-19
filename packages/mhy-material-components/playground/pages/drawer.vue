<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
  title: "Drawer",
})

const drawerItems: DrawerItemOrDivider[] = [
  {
    to: "/material-card",
    icon: "mdi-home",
  },
]
</script>

<template>
  <client-only>
    <AppDrawer
      :model-value="true"
      :drawer-items="drawerItems"
    />
  </client-only>
</template>

<style scoped>

</style>
