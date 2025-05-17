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
        :title="entry.title"
        :to="$localePath(entry.path)"
      />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
usePageTitle(tx("pageTitles.home"))

interface Entry {
  title: string
  path: string
  icon: string
}

const entries: Entry[] = [
  {
    title: tx("pageTitles.characters"),
    icon: "mdi-account",
    path: "/characters",
  },
  {
    title: tx("pageTitles.lightCones"),
    icon: "mdi-cone",
    path: "/light-cones",
  },
  {
    title: tx("pageTitles.relics"),
    icon: "mdi-star-david",
    path: "/relics",
  },
  {
    title: tx("pageTitles.materials"),
    icon: "mdi-grass",
    path: "/materials",
  },
  {
    title: tx("pageTitles.tpCalc"),
    icon: "mdi-sphere",
    path: "/tp-calc",
  },
  {
    title: tx("pageTitles.warps"),
    icon: "mdi-history",
    path: "/warps",
  },
]
</script>
