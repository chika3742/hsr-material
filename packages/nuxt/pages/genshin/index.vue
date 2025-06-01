<template>
  <div class="d-flex flex-column ga-4">
    <h1 style="font-size: 1.5em">
      {{ $t("indexPageGenshin.title") }}
    </h1>
    <p>{{ tx("indexPageGenshin.desc") }}</p>
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

const pathPrefix = "/genshin"

const entries: Entry[] = [
  {
    title: tx("pageTitles.characters"),
    desc: tx("indexPageGenshin.charactersDesc"),
    icon: "mdi-account",
    path: `${pathPrefix}/characters`,
  },
  {
    title: tx("pageTitles.weapons"),
    desc: tx("indexPageGenshin.weaponsDesc"),
    icon: "mdi-sword",
    path: `${pathPrefix}/weapons`,
  },
  {
    title: tx("pageTitles.artifacts"),
    desc: tx("indexPageGenshin.artifactsDesc"),
    icon: "mdi-flower",
    path: `${pathPrefix}/artifacts`,
  },
  {
    title: tx("pageTitles.furnishingSets"),
    desc: tx("indexPageGenshin.furnishingSetsDesc"),
    icon: "mdi-sofa-single",
    path: `${pathPrefix}/furnishing-sets`,
  },
  {
    title: tx("pageTitles.materials"),
    desc: tx("indexPageGenshin.materialsDesc"),
    icon: "mdi-grass",
    path: `${pathPrefix}/materials`,
  },
  {
    title: tx("pageTitles.resinCalc"),
    desc: tx("indexPageGenshin.resinCalcDesc"),
    icon: "mdi-moon-waxing-crescent",
    path: `${pathPrefix}/resin-calc`,
  },
  {
    title: tx("pageTitles.wishes"),
    desc: tx("indexPageGenshin.wishesDesc"),
    icon: "mdi-history",
    path: `${pathPrefix}/wishes`,
  },
]
</script>
