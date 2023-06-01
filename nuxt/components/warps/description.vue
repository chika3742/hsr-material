<script setup lang="ts">
const {$marked} = useNuxtApp()
const snackbar = useSnackbar()
const i18n = useI18n()

const marked = $marked({gfm: false})

const streamUrl = "https://apps.apple.com/app/stream/id1312141691"

const windowsCommandCode = ref<HTMLElement>()

const copyWindowsCommand = () => {
  window.navigator.clipboard.writeText(windowsCommandCode.value!.innerText)
  snackbar.show("コピーしました")
}

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
        <client-only>
          <teleport to="#windows-script">
            <div class="d-flex flex-nowrap align-center">
              <pre>
                <code ref="windowsCommandCode">iex "&{$(irm https://gist.githubusercontent.com/chika3742/0542db8a5e329fb15af9e37714e92893/raw/899a52ae891cc150654d8428df8d57b141746446/getlink.ps1)} global"</code>
              </pre>
              <v-btn class="ml-2" flat icon="ms:content_copy" @click="copyWindowsCommand" />
            </div>
          </teleport>
        </client-only>
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
