<template>
  <v-app>
    <AppDrawer
      v-model="isDrawerOpenOnMobile"
      :drawer-items="drawerItems"
    />

    <GlobalAppBar
      @nav-icon-clicked="isDrawerOpenOnMobile = true"
      @search-icon-clicked="showSearchDialog = true"
    />

    <v-main class="h-100">
      <GlobalPageLoadIndicator />

      <div class="d-flex flex-column h-100">
        <v-container v-safe-area="{ left: 16, right: 16 }">
          <slot />
        </v-container>

        <v-spacer />

        <GlobalFooter />
      </div>
    </v-main>

    <GameDataSyncDialogImpl v-model="showGameDataSyncDialog" />

    <SearchDialog v-model="showSearchDialog" />

    <GlobalSnackbarView />

    <GlobalLoadingOverlay />
  </v-app>
</template>

<script setup lang="ts">
import type { DrawerItemOrDivider } from "~/components/app/AppDrawer.vue"

const i18n = useI18n()

const isDrawerOpenOnMobile = ref(false)
const showSearchDialog = ref(false)
const showGameDataSyncDialog = ref(false)

useGlobalTheme()

const pathPrefix = "/hsr"
const drawerItems = computed<DrawerItemOrDivider[]>(() => {
  return [
    {
      title: tx(i18n, "pageTitles.home"),
      icon: "mdi-home",
      to: `${pathPrefix}/`,
    },
    {
      title: tx(i18n, "pageTitles.bookmarks"),
      icon: "mdi-bookmark-multiple",
      to: `${pathPrefix}/bookmarks`,
    },
    {
      icon: "mdi-import",
      title: tx(i18n, "navDrawer.gameDataSync"),
      onClick() {
        showGameDataSyncDialog.value = true
      },
    },
    "---" as const,
    {
      title: tx(i18n, "pageTitles.characters"),
      icon: "mdi-account",
      to: `${pathPrefix}/characters`,
    },
    {
      title: tx(i18n, "pageTitles.lightCones"),
      icon: "mdi-cone",
      to: `${pathPrefix}/light-cones`,
    },
    {
      title: tx(i18n, "pageTitles.relics"),
      icon: "mdi-star-david",
      to: `${pathPrefix}/relics`,
    },
    {
      title: tx(i18n, "pageTitles.materials"),
      icon: "mdi-grass",
      to: `${pathPrefix}/materials`,
    },
    "---" as const,
    {
      title: tx(i18n, "pageTitles.warps"),
      icon: "ms:history",
      to: `${pathPrefix}/warps`,
    },
    {
      title: tx(i18n, "pageTitles.tpCalc"),
      icon: "mdi-sphere",
      to: `${pathPrefix}/tp-calc`,
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
  ]
})
</script>
