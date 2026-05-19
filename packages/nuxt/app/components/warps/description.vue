<script setup lang="ts">
import { CustomMarked } from "~/libs/custom-marked"

const i18n = useI18n()
const snackbar = useSnackbar()

const marked = new CustomMarked({ gfm: false })

const streamUrl = "https://apps.apple.com/app/stream/id1312141691"

const copyCmdLine = async (cmdline: string) => {
  await navigator.clipboard.writeText(cmdline)
  snackbar.show(i18n.t("warpsPage.copied"))
}

const cmdlineWin = i18n.t("warpsPage.howToGetUrl.windows.cmdline")
const cmdlineMacos1 = "curl \"https://gist.githubusercontent.com/chika3742/3a65b7530c021b9ac631408b033edc4f/raw/install-ca.sh\" | bash"
const cmdlineMacos2 = "curl \"https://gist.githubusercontent.com/chika3742/3a65b7530c021b9ac631408b033edc4f/raw/run.sh\" | bash"
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
      <v-expansion-panel-text eager>
        <client-only>
          <div v-html="marked.parse($t('warpsPage.howToGetUrl.windows.contents', { cmdline: cmdlineWin }))" />
          <teleport to="#cmd-win">
            <v-btn
              icon="mdi-content-copy"
              variant="text"
              @click="copyCmdLine(cmdlineWin)"
            />
          </teleport>
        </client-only>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.howToGetUrl.ios.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <div v-html="marked.parse(i18n.t('warpsPage.howToGetUrl.ios.contents', { streamUrl }))" />
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-title>{{ $t("warpsPage.howToGetUrl.macos.title") }}</v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <client-only>
          <div
            v-html="marked.parse($t('warpsPage.howToGetUrl.macos.contents', { cmdline1: cmdlineMacos1, cmdline2: cmdlineMacos2 }))"
          />
          <teleport to="#cmd-macos-1">
            <v-btn
              icon="mdi-content-copy"
              variant="text"
              @click="copyCmdLine(cmdlineMacos1)"
            />
          </teleport>
          <teleport to="#cmd-macos-2">
            <v-btn
              icon="mdi-content-copy"
              variant="text"
              @click="copyCmdLine(cmdlineMacos2)"
            />
          </teleport>
        </client-only>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="sass">
#windows-script
  height: 48px
</style>
