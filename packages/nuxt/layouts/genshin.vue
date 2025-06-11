<template>
  <v-app :theme="theme === 'dark' ? 'genshinDark' : 'genshinLight'">
    <AppDrawer
      v-model="isDrawerOpenOnMobile"
      :drawer-items="drawerItems"
    />

    <GlobalAppBar
      hide-search-icon
      @nav-icon-clicked="isDrawerOpenOnMobile = true"
    />

    <v-main class="h-100">
      <GlobalPageLoadIndicator />

      <div class="d-flex flex-column h-100">
        <v-container v-safe-area="{ left: 16, right: 16 }">
          <DataProvider game="genshin">
            <slot />
          </DataProvider>
        </v-container>

        <v-spacer />

        <GlobalFooter />
      </div>
    </v-main>

    <GlobalSnackbarView />

    <GlobalLoadingOverlay />
  </v-app>
</template>

<script setup lang="ts">
import type { DrawerItemOrDivider } from "~/components/app/AppDrawer.vue"

const i18n = useI18n()
const theme = useGlobalTheme()

const isDrawerOpenOnMobile = ref(false)

const pathPrefix = "/genshin"
const drawerItems = computed<DrawerItemOrDivider[]>(() => ([
  {
    icon: "mdi-home",
    title: tx(i18n, "pageTitles.home"),
    to: `${pathPrefix}/`,
  },
  {
    icon: "mdi-bookmark-multiple",
    title: tx(i18n, "pageTitles.bookmarks"),
    to: `${pathPrefix}/bookmarks`,
  },
  "---" as const,
  {
    title: tx(i18n, "pageTitles.characters"),
    icon: "mdi-account",
    to: `${pathPrefix}/characters`,
  },
  {
    title: tx(i18n, "pageTitles.weapons"),
    icon: "mdi-sword",
    to: `${pathPrefix}/weapons`,
  },
  {
    title: tx(i18n, "pageTitles.artifacts"),
    icon: "mdi-flower",
    to: `${pathPrefix}/artifacts`,
  },
  {
    title: tx(i18n, "pageTitles.furnishingSets"),
    icon: "mdi-sofa-single",
    to: `${pathPrefix}/furnishing-sets`,
  },
  {
    title: tx(i18n, "pageTitles.materials"),
    icon: "mdi-grass",
    to: `${pathPrefix}/materials`,
  },
  "---" as const,
  {
    title: tx(i18n, "pageTitles.wishes"),
    icon: "ms:history",
    to: `${pathPrefix}/wishes`,
  },
  {
    title: tx(i18n, "pageTitles.resinCalc"),
    icon: "mdi-moon-waxing-crescent",
    to: `${pathPrefix}/resin-calc`,
  },
  {
    title: tx(i18n, "pageTitles.sync"),
    icon: "mdi-book-sync",
    to: "/sync",
  },
  "---" as const,
  {
    title: tx(i18n, "pageTitles.settings"),
    icon: "mdi-cog",
    to: `${pathPrefix}/settings`,
  },
  {
    title: tx(i18n, "pageTitles.about"),
    icon: "mdi-information",
    to: "/about",
  },
  {
    title: tx(i18n, "navDrawer.kofi"),
    icon: "mdi-coffee",
    href: "https://ko-fi.com/chika3742",
    target: "_blank",
  },
]))
</script>
