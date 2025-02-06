<template>
  <div>
    <h1 style="font-size: 1.5em">
      {{ $t("common.appName") }}
    </h1>
    <v-list class="mt-4">
      <v-list-item
        v-for="entry in entries"
        :key="entry.path"
        :prepend-icon="entry.icon"
        :title="getPageTitle(entry.path)"
        :to="$localePath(entry.path)"
      />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "home",
})

interface Entry {
  path: string
  icon: string
}

const entries: Entry[] = [
  {
    icon: "mdi-account",
    path: "/characters",
  },
  {
    icon: "mdi-cone",
    path: "/light-cones",
  },
  {
    icon: "mdi-star-david",
    path: "/relics",
  },
  {
    icon: "mdi-grass",
    path: "/materials",
  },
  {
    icon: "mdi-sphere",
    path: "/tp-calc",
  },
  {
    icon: "mdi-history",
    path: "/warps",
  },
]
</script>
