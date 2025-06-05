<template>
  <NuxtLayout>
    <NuxtPage
      :keepalive="{ max: 5, exclude: ['v-tooltip'] }"
      :page-key="$router.currentRoute.value.path"
    />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { Unsubscribe } from "firebase/auth"
import { useSnackbar } from "~/composables/snackbar"
import { _db } from "~/dexie/db"
import { FirestoreProvider } from "~/libs/firestore/firestore-provider"

const router = useRouter()
const i18n = useI18n()
const snackbar = useSnackbar()
const config = useConfigStore()
const rConfig = useRuntimeConfig()
const { $auth, $firestore } = useNuxtApp()
const localePath = useLocalePath()

const title = usePageTitle()
const titleTemplate = computed(() => {
  return `%s - ${tx(i18n, `games.${getCurrentGame()}`)}${i18n.t("common.appName")}`
})

useHead({
  title,
  titleTemplate,
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

onMounted(() => {
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
