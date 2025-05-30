<template>
  <div>
    <v-app>
      <AppDrawer
        v-model="isDrawerOpenOnMobile"
        :drawer-items="drawerItems"
      />

      <v-app-bar>
        <template #prepend>
          <v-app-bar-nav-icon
            v-if="$vuetify.display.mobile"
            @click="isDrawerOpenOnMobile = true"
          />
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <template #append>
          <v-app-bar-nav-icon
            icon="mdi-magnify"
            @click="showSearchDialog = true"
          />
        </template>
      </v-app-bar>

      <v-main class="h-100">
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

        <div class="d-flex flex-column h-100">
          <v-container v-safe-area="{ left: 16, right: 16 }">
            <NuxtPage
              :keepalive="{ max: 5, exclude: ['v-tooltip'] }"
              :page-key="$router.currentRoute.value.path"
            />
          </v-container>

          <v-spacer />

          <div
            v-if="!isProd"
            class="warning-overlay-banner"
          >
            <span>{{ tx("common.nonProdWarning") }}</span>
          </div>

          <!--          <div -->
          <!--            class="warning-overlay-banner" -->
          <!--          > -->
          <!--            <a -->
          <!--              href="https://www.chikach.net/category/info/sunset-of-material-notebooks" -->
          <!--              target="_blank" -->
          <!--              class="link" -->
          <!--            >【重要】サービス終了について</a> -->
          <!--          </div> -->

          <AppFooter
            v-model:theme-setting="config.theme"
            :current-version="getCurrentVersionText()"
            :feedback-page-url="feedbackPageUrl"
            :hoyolab-article-url="hoyolabArticleUrl"
            :repository-url="repositoryUrl"
          />
        </div>
      </v-main>

      <client-only>
        <v-snackbar
          v-model="snackbar.ref.value.displayed"
          :color="snackbar.ref.value.color ?? undefined"
        >
          <span>{{ snackbar.ref.value.message }}</span>

          <template #actions>
            <v-btn
              v-for="(action, i) in snackbar.ref.value.actions"
              :key="i"
              :text="action.text"
              color="primary"
              style="filter: invert(1)"
              variant="text"
              @click="action.onClick(); snackbar.ref.value.displayed = false"
            />
          </template>
        </v-snackbar>

        <v-dialog
          v-model="dialog.ref.value.displayed"
          :persistent="dialog.ref.value.persistent"
          max-width="500px"
          @close="dialog.ref.value.onCancel"
        >
          <v-card :title="dialog.ref.value.title">
            <template #text>
              <p class="text-pre-wrap">
                {{ dialog.ref.value.content }}
              </p>
            </template>
            <template #actions>
              <v-spacer />
              <v-btn @click="dialog.ref.value.onCancel">
                {{ $t("common.cancel") }}
              </v-btn>
              <v-btn @click="dialog.ref.value.onOk">
                {{ $t("common.ok") }}
              </v-btn>
            </template>
          </v-card>
        </v-dialog>
      </client-only>

      <GameDataSyncDialogImpl v-model="showGameDataSyncDialog" />

      <SearchDialog v-model="showSearchDialog" />

      <v-fade-transition>
        <div
          v-show="!mounted"
          class="loading-overlay"
        />
      </v-fade-transition>
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify"
import type { Unsubscribe } from "firebase/auth"
import type { DrawerItemOrDivider } from "./components/app/AppDrawer.vue"
import { ref } from "#imports"
import { useSnackbar } from "~/composables/snackbar"
import { useDialog } from "~/composables/dialog"
import { _db } from "~/dexie/db"
import { FirestoreProvider } from "~/libs/firestore/firestore-provider"

const router = useRouter()
const i18n = useI18n()
const dialog = useDialog()
const snackbar = useSnackbar()
const theme = useTheme()
const config = useConfigStore()
const rConfig = useRuntimeConfig()
const { $auth, $firestore } = useNuxtApp()
const localePath = useLocalePath()

const isProd = rConfig.public.isProdBranch
const repositoryUrl = "https://github.com/chika3742/hsr-material"
const feedbackPageUrl = "https://www.chikach.net/hsr-material-fb"
const hoyolabArticleUrl = "https://www.hoyolab.com/article/18406761"
const drawerItems = computed<DrawerItemOrDivider[]>(() => {
  return [
    {
      title: tx(i18n, "pageTitles.home"),
      icon: "mdi-home",
      to: "/",
    },
    {
      title: tx(i18n, "pageTitles.bookmarks"),
      icon: "mdi-bookmark-multiple",
      to: "/bookmarks",
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
      to: "/characters",
    },
    {
      title: tx(i18n, "pageTitles.lightCones"),
      icon: "mdi-cone",
      to: "/light-cones",
    },
    {
      title: tx(i18n, "pageTitles.relics"),
      icon: "mdi-star-david",
      to: "/relics",
    },
    {
      title: tx(i18n, "pageTitles.materials"),
      icon: "mdi-grass",
      to: "/materials",
    },
    "---" as const,
    {
      title: tx(i18n, "pageTitles.warps"),
      icon: "ms:history",
      to: "/warps",
    },
    {
      title: tx(i18n, "pageTitles.tpCalc"),
      icon: "mdi-sphere",
      to: "/tp-calc",
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
      to: "/settings",
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

const isDrawerOpenOnMobile = ref(false)
const mounted = ref(false)
const isLoadingPage = ref(false)
const showSearchDialog = ref(false)
const showGameDataSyncDialog = ref(false)

const title = usePageTitle()

useHead({
  title,
  titleTemplate: `%s - ${i18n.t("common.appName")}`,
})

useSeoMeta({
  ogImage: "https://hsr.matnote.app/favicon.webp",
  ogTitle: "崩壊：スターレイル 素材ノート",
  ogSiteName: "崩壊：スターレイル 素材ノート",
  ogDescription: "スターレイルの素材集めを手助けするWebアプリ。",
  ogType: "website",
  twitterCard: "summary",
  twitterSite: "@chikavoid",
})

let unsubscribeAuthListener: Unsubscribe | null = null

onBeforeMount(() => {
  if ("serviceWorker" in navigator) {
    const scriptUrl = process.env.NODE_ENV === "production" ? "/sw.js" : "/sw-dev.js"
    navigator.serviceWorker.register(scriptUrl).catch((e) => {
      console.error("Service worker registration failed:", e)
    })
  }
})

const updateCurrentTheme = () => {
  setTimeout(() => {
    theme.global.name.value = config.getCurrentTheme()
  })
}
watch(toRefs(config).theme, () => {
  updateCurrentTheme()
}, { immediate: true })

onMounted(() => {
  mounted.value = true

  // listen to theme change
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    updateCurrentTheme()
  })

  // init firestore snapshot listener
  if ($auth) {
    unsubscribeAuthListener = $auth.onAuthStateChanged((user) => {
      if (user) {
        FirestoreProvider.instance = new FirestoreProvider($auth.currentUser!, $firestore, _db)
        FirestoreProvider.instance.listen()
      } else {
        FirestoreProvider.instance?.unListen()
        FirestoreProvider.instance = null
      }
    })
  }

  // show update snackbar
  if (rConfig.public.isProdBranch && config.previousVersion !== getCurrentVersionText()) {
    snackbar.show(tx(i18n, "common.updated", { version: getCurrentVersionText() }), null, {
      text: tx(i18n, "pageTitles.releaseNotes"),
      onClick() {
        void router.push(localePath("/release-notes"))
      },
    })

    config.previousVersion = getCurrentVersionText()
  }
  config.$persist()
})

onBeforeUnmount(() => {
  unsubscribeAuthListener?.()
})

router.beforeEach(() => {
  isLoadingPage.value = true
  snackbar.ref.value.displayed = false
})

router.afterEach(() => {
  isLoadingPage.value = false
})
</script>

<style lang="sass" scoped>
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

.warning-overlay-banner
  width: 100%
  position: sticky
  padding: 8px 16px
  font-size: 0.8em
  bottom: 0
  z-index: 999
  background: rgba(var(--v-theme-warning), 0.6)
  font-weight: bold
  backdrop-filter: blur(8px)

  a
    font-weight: bold
</style>
