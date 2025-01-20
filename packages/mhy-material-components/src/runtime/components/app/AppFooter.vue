<template>
  <v-footer
    elevation="4"
    color="footer"
    class="flex-grow-0"
  >
    <div
      v-safe-area="{ left: true, bottom: true, right: true }"
      class="d-flex flex-column w-100"
    >
      <div class="d-flex align-center justify-end flex-wrap mb-4">
        <v-btn
          icon="mdi-twitter"
          href="https://twitter.com/gms_material"
          target="_blank"
          variant="text"
          density="comfortable"
        />
        <v-btn
          icon="mdi-github"
          :href="repositoryUrl"
          target="_blank"
          variant="text"
          density="comfortable"
        />
        <client-only>
          <v-btn
            density="comfortable"
            variant="text"
          >
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
        <v-btn
          :to="localePath('/release-notes')"
          color="primary"
          variant="text"
          density="comfortable"
        >
          {{ $t('pageTitles.releaseNotes') }}
        </v-btn>
        <v-btn
          :to="localePath('/terms')"
          variant="text"
          density="comfortable"
        >
          {{ $t('pageTitles.terms') }}
        </v-btn>
        <v-btn
          :to="localePath('/privacy')"
          variant="text"
          density="comfortable"
        >
          {{ $t('pageTitles.privacy') }}
        </v-btn>
        <v-btn
          prepend-icon="mdi-earth"
          variant="text"
          density="comfortable"
        >
          LANG
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                v-for="lang in availableLocales"
                :key="lang.code"
                :active="$i18n.locale === lang.code"
                @click="$i18n.setLocale(lang.code)"
              >
                <v-list-item-title>{{ lang.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn
          prepend-icon="mdi-brightness-4"
          variant="text"
          density="comfortable"
        >
          {{ $t('footer.theme') }}
          <!-- to avoid hydration node mismatch error -->
          <client-only>
            <v-menu activator="parent">
              <v-list
                :selected="[themeSetting]"
                @update:selected="$emit('update:themeSetting', $event[0])"
              >
                <v-list-item
                  :title="$t('footer.themeOptions.light')"
                  prepend-icon="mdi-brightness-7"
                  value="light"
                />
                <v-list-item
                  :title="$t('footer.themeOptions.dark')"
                  prepend-icon="mdi-brightness-3"
                  value="dark"
                />
                <v-list-item
                  :title="$t('footer.themeOptions.auto')"
                  prepend-icon="mdi-brightness-auto"
                  value="auto"
                />
              </v-list>
            </v-menu>
          </client-only>
        </v-btn>
      </div>
      <div
        class="d-flex align-end flex-wrap"
        style="font-size: 0.7em; gap: 16px"
      >
        <div class="d-flex flex-column">
          <span>©chika {{ new Date().getFullYear() }}</span>
          <span style="white-space: pre-wrap">{{ $t("footer.disclaimer") }}</span>
        </div>
        <v-spacer />
        <client-only>
          <span>{{ currentVersion }}</span>
        </client-only>
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import { computed, useI18n } from "#imports"

interface Props {
  /**
   * Current version text
   */
  currentVersion: string
  /**
   * Current theme setting value
   */
  themeSetting: ThemeSetting
  /**
   * Repository URL without trailing slash
   */
  repositoryUrl: string
  /**
   * Feedback page URL
   */
  feedbackPageUrl: string
  /**
   * HoYoLAB Article URL for feedback
   */
  hoyolabArticleUrl: string
}

const props = defineProps<Props>()

interface Emits {
  (e: "update:themeSetting", value: ThemeSetting): void
}

defineEmits<Emits>()

const i18n = useI18n()

const availableLocales: { code: string, name: string }[] = [
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
]

const feedbackUrl = computed(() => {
  if (!import.meta.client) {
    return ""
  }

  return `${props.repositoryUrl}/issues/new/choose?app-version=${props.currentVersion}`
})

const feedbackMenuItems = computed(() => {
  return [
    {
      title: i18n.t("footer.feedbackMenuItems.comment"),
      desc: i18n.t("footer.feedbackMenuItems.commentDesc"),
      url: props.feedbackPageUrl,
    },
    {
      title: i18n.t("footer.feedbackMenuItems.hoyolab"),
      desc: i18n.t("footer.feedbackMenuItems.hoyolabDesc"),
      url: props.hoyolabArticleUrl,
    },
    {
      title: i18n.t("footer.feedbackMenuItems.github"),
      desc: i18n.t("footer.feedbackMenuItems.githubDesc"),
      url: feedbackUrl.value,
    },
  ]
})
</script>
