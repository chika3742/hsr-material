<template>
  <div>
    <v-app>
      <client-only>
        <AppDrawer v-model="isDrawerOpenOnMobile" />
      </client-only>

      <v-app-bar>
        <template #prepend>
          <v-app-bar-nav-icon
            v-show="$vuetify.display.mobile"
            @click="isDrawerOpenOnMobile = true"
          />
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <template #append>
          <v-app-bar-nav-icon icon="mdi-magnify" @click="showSearchDialog = true" />
        </template>
      </v-app-bar>

      <client-only>
        <SearchDialog v-model="showSearchDialog" />
      </client-only>

      <v-main class="h-100">
        <div class="position-fixed" style="top: 64px; width: 100%; z-index: 9999">
          <v-progress-linear :active="loadingPage" color="primary" indeterminate />
        </div>

        <div class="d-flex flex-column h-100">
          <v-container>
            <NuxtPage :keepalive="{max: 5, exclude: ['v-tooltip']}" :page-key="$route.fullPath" />
          </v-container>

          <v-spacer />

          <div class="warning-overlay-banner">
            <span>{{ isProd ? tx("common.betaWarning") : tx("common.nonProdWarning") }}</span>
          </div>
          <AppFooter />
        </div>

        <client-only>
          <v-snackbar v-model="snackbar.ref.value.displayed" :color="snackbar.ref.value.color ?? undefined">
            {{ snackbar.ref.value.message }}
          </v-snackbar>

          <v-dialog
            v-model="dialog.ref.value.displayed"
            :persistent="!dialog.ref.value.cancelable"
            max-width="400px"
            @close="dialog.ref.value.onCancel"
          >
            <v-card :text="dialog.ref.value.content" :title="dialog.ref.value.title">
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
      </v-main>

      <v-fade-transition>
        <div v-show="!mounted" class="loading-overlay" />
      </v-fade-transition>
    </v-app>
  </div>
</template>

<script lang="ts" setup>
import {useTheme} from "vuetify"
import {ref} from "#imports"
import {useSnackbar} from "~/composables/snackbar"
import {useDialog} from "~/composables/dialog"
import {useConfigStore} from "~/store/config"

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const dialog = useDialog()
const snackbar = useSnackbar()
const theme = useTheme()
const config = useConfigStore()
const rConfig = useRuntimeConfig()

const isProd = rConfig.public.isProdBranch

const isDrawerOpenOnMobile = ref(false)
const mounted = ref(false)
const loadingPage = ref(false)
const showSearchDialog = ref(false)

const title = computed(() => getPageTitle(route.fullPath, router, i18n))

useHead({
  title,
  titleTemplate: `%s - ${i18n.t("common.appName")}`,
})

onMounted(() => {
  mounted.value = true

  theme.global.name.value = config.getCurrentTheme()

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    theme.global.name.value = config.getCurrentTheme()
  })
})

router.beforeEach(() => {
  loadingPage.value = true
})

router.afterEach(() => {
  loadingPage.value = false
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

</style>
