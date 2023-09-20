<script setup lang="ts">
import {CustomMarked} from "~/libs/custom-marked"

const i18n = useI18n()

const marked = new CustomMarked({gfm: false})

const streamUrl = "https://apps.apple.com/app/stream/id1312141691"
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.aboutTitle") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-html="marked.parse($t('warpsPage.about'))" />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.howToGetUrl.windows.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-html="marked.parse(i18n.t('warpsPage.howToGetUrl.windows.contents'))" />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.howToGetUrl.ios.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-html="marked.parse(i18n.t('warpsPage.howToGetUrl.ios.contents', {streamUrl}))" />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.howToGetUrl.macos.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-html="marked.parse(i18n.t('warpsPage.howToGetUrl.macos.contents'))" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="sass">
#windows-script
  height: 48px
</style>
