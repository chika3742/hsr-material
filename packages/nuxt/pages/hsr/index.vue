<template>
  <div class="d-flex flex-column ga-4">
    <h1 style="font-size: 1.5em">
      {{ $t("indexPageHsr.title") }}
    </h1>
    <p>{{ tx("indexPageHsr.desc") }}</p>
    <v-list class="mt-4">
      <v-list-item
        v-for="entry in entries"
        :key="entry.path"
        :prepend-icon="entry.icon"
        :title="entry.title"
        :subtitle="entry.desc"
        lines="two"
        :to="$localePath(entry.path)"
      />
    </v-list>
  </div>
</template>

<script lang="ts" setup>
usePageTitle(tx("pageTitles.home"))

interface Entry {
  title: string
  desc: string
  path: string
  icon: string
}

const pathPrefix = "/hsr"

const entries: Entry[] = [
  {
    title: tx("pageTitles.characters"),
    desc: tx("indexPageHsr.charactersDesc"),
    icon: "mdi-account",
    path: `${pathPrefix}/characters`,
  },
  {
    title: tx("pageTitles.lightCones"),
    desc: tx("indexPageHsr.lightConesDesc"),
    icon: "mdi-cone",
    path: `${pathPrefix}/light-cones`,
  },
  {
    title: tx("pageTitles.relics"),
    desc: tx("indexPageHsr.relicsDesc"),
    icon: "mdi-star-david",
    path: `${pathPrefix}/relics`,
  },
  {
    title: tx("pageTitles.materials"),
    desc: tx("indexPageHsr.materialsDesc"),
    icon: "mdi-grass",
    path: `${pathPrefix}/materials`,
  },
  {
    title: tx("pageTitles.tpCalc"),
    desc: tx("indexPageHsr.tpCalcDesc"),
    icon: "mdi-sphere",
    path: `${pathPrefix}/tp-calc`,
  },
  {
    title: tx("pageTitles.warps"),
    desc: tx("indexPageHsr.warpsDesc"),
    icon: "mdi-history",
    path: `${pathPrefix}/warps`,
  },
]
</script>
