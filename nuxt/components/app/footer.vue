<template>
  <v-footer elevation="4" color="footer" class="flex-grow-0">
    <div v-safe-area="{top: false}" class="d-flex flex-column w-100">
      <div class="d-flex align-center justify-end flex-wrap mb-4">
        <v-btn icon="mdi-twitter" href="https://twitter.com/gms_material" target="_blank" variant="text" density="comfortable" />
        <v-btn icon="mdi-github" href="https://github.com/chika3742/hsr-material" target="_blank" variant="text" density="comfortable" />
        <client-only>
          <v-btn density="comfortable" variant="text">
            {{ $t('footer.feedback') }}

            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  v-for="(item, i) in feedbackMenuItems"
                  :key="i"
                  :href="item.url"
                  :subtitle="item.desc"
                  :title="item.title"
                  lines="two"
                  target="_blank"
                />
              </v-list>
            </v-menu>
          </v-btn>
        </client-only>
        <v-btn :to="localePath('/release-notes')" color="primary" variant="text" density="comfortable">
          {{ $t('pageTitles.releaseNotes') }}
        </v-btn>
        <v-btn :to="localePath('/terms')" variant="text" density="comfortable">
          {{ $t('pageTitles.terms') }}
        </v-btn>
        <v-btn :to="localePath('/privacy')" variant="text" density="comfortable">
          {{ $t('pageTitles.privacy') }}
        </v-btn>
        <v-btn prepend-icon="mdi-earth" variant="text" density="comfortable">
          LANG
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                v-for="lang in availableLocales"
                :key="lang.code"
                :active="$i18n.locale === lang.code"
                :href="switchLocalePath(lang.code)"
              >
                <v-list-item-title>{{ lang.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn prepend-icon="mdi-brightness-4" variant="text" density="comfortable">
          {{ $t('footer.theme') }}
          <!-- to avoid hydration node mismatch error -->
          <client-only>
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  :title="$t('footer.themeOptions.light')"
                  prepend-icon="mdi-brightness-7"
                  :active="config.theme === 'light'"
                  @click="setTheme('light')"
                />
                <v-list-item
                  :title="$t('footer.themeOptions.dark')"
                  prepend-icon="mdi-brightness-3"
                  :active="config.theme === 'dark'"
                  @click="setTheme('dark')"
                />
                <v-list-item
                  :title="$t('footer.themeOptions.auto')"
                  prepend-icon="mdi-brightness-auto"
                  :active="config.theme === 'auto'"
                  @click="setTheme('auto')"
                />
              </v-list>
            </v-menu>
          </client-only>
        </v-btn>
      </div>
      <div class="d-flex align-end flex-wrap" style="font-size: 0.7em; gap: 16px">
        <div class="d-flex flex-column">
          <span>©chika {{ new Date().getFullYear() }}</span>
          <span style="white-space: pre-wrap">{{ $t("footer.disclaimer") }}</span>
        </div>
        <v-spacer />
        <client-only>
          <span>{{ getCurrentVersionText() }}</span>
        </client-only>
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import {useTheme} from "vuetify"
import UAParser from "ua-parser-js"
import {useConfigStore} from "~/store/config"
import {ThemeSetting} from "~/types/strings"

const config = useConfigStore()
const vTheme = useTheme()
const i18n = useI18n()

const availableLocales: {code: string, name: string}[] = [
  {code: "ja", name: "日本語"},
  {code: "en", name: "English"},
]

const setTheme = (theme: ThemeSetting) => {
  config.theme = theme
  vTheme.global.name.value = config.getCurrentTheme()
}

const feedbackUrl = computed(() => {
  if (!process.client) { return "" }

  const ua = new UAParser(navigator.userAgent)
  const browser = ua.getBrowser()
  return `https://github.com/chika3742/hsr-material/issues/new/choose?browser=${browser.name} ${browser.version}&app-version=${getCurrentVersionText()}`
})

const feedbackMenuItems = computed(() => {
  return [
    {
      title: tx(i18n, "footer.feedbackMenuItems.comment"),
      desc: tx(i18n, "footer.feedbackMenuItems.commentDesc"),
      url: "https://www.chikach.net/hsr-material-fb",
    },
    {
      title: tx(i18n, "footer.feedbackMenuItems.hoyolab"),
      desc: tx(i18n, "footer.feedbackMenuItems.hoyolabDesc"),
      url: "https://www.hoyolab.com/article/18406761",
    },
    {
      title: tx(i18n, "footer.feedbackMenuItems.github"),
      desc: tx(i18n, "footer.feedbackMenuItems.githubDesc"),
      url: feedbackUrl.value,
    },
  ]
})

</script>
