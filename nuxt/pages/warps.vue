<template>
  <div class="doc-container">
    <WarpsDescription />

    <client-only>
      <section>
        <h2>{{ $t("warpsPage.urlInput") }}</h2>
        <v-text-field
          v-model="url"
          :disabled="fetching"
          :error-messages="error"
          class="ma-2"
          clearable
          label="URL"
        />
        <div class="mb-4">
          <v-checkbox
            v-model="warps.untilLatestRare"
            :disabled="warps.warps.length > 0 || fetching"
            :label="$t('warpsPage.getUntilLatestRare')"
            color="primary"
            density="compact"
            hide-details
          />
          <div style="font-size: 0.9em">
            {{ $t('warpsPage.getUntilLatestRareDesc') }}
          </div>
        </div>
        <v-row no-gutters style="gap: 16px">
          <v-spacer />
          <v-btn @click="clearWarps">
            {{ $t("warpsPage.clear") }}
          </v-btn>
          <v-btn :loading="fetching" color="primary" @click="getWarps">
            {{ $t("warpsPage.get") }}
          </v-btn>
        </v-row>
        <div v-show="fetching" class="mt-2" style="text-align: end">
          {{
            fetchedCount !== null ? i18n.t("warpsPage.progress", {count: fetchedCount}) : $t('warpsPage.preparing')
          }}
        </div>
      </section>
    </client-only>

    <client-only>
      <section v-for="warpType in warpTypes" :key="warpType.type">
        <h2>{{ warpType.title }}</h2>
        <WarpsCounters
          :pseudo-pity-border="warpType.pseudoPityBorder"
          :single-prob="warpType.singleProb"
          :star5-pity="warpType.star5Pity"
          :warps="warps.warps.filter(e => warpType.type === e.gachaType)"
          class="my-2"
        />
      </section>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {doc, onSnapshot} from "@firebase/firestore"
import {ref} from "#imports"
import {useConfigStore} from "~/store/config"
import {useWarpsStore} from "~/store/warps"
import {WarpsApi} from "~/libs/warps-api"
import {warpHistoryTicketConverter} from "~/utils/warp-history-ticket-converter"

definePageMeta({
  title: "warps",
})

const config = useConfigStore()
const i18n = useI18n()
const warps = useWarpsStore()
const snackbar = useSnackbar()
const dialog = useDialog()
const {$functions, $firestore} = useNuxtApp()

const url = ref(config.warpsUrl)
const error = ref("")
const fetchedCount = ref<number | null>(null)
const fetching = ref(false)

const warpTypes: {
  type: string
  title: string
  star5Pity: number
  pseudoPityBorder: number
  singleProb: number
}[] = [
  {
    type: "11",
    title: i18n.t("warpsPage.warpTypes.11"),
    star5Pity: 90,
    pseudoPityBorder: 73,
    singleProb: 0.006,
  },
  {
    type: "12",
    title: i18n.t("warpsPage.warpTypes.12"),
    star5Pity: 80,
    pseudoPityBorder: 63,
    singleProb: 0.007,
  },
  {
    type: "1",
    title: i18n.t("warpsPage.warpTypes.1"),
    star5Pity: 90,
    pseudoPityBorder: 73,
    singleProb: 0.006,
  },
]

const getWarps = () => {
  fetchedCount.value = null
  error.value = ""
  fetching.value = true

  const api = new WarpsApi($functions, url.value)

  api.createTicket(warps.lastIds, warps.untilLatestRare).then(() => {
    config.warpsUrl = url.value

    registerStatusListener(api)
    return null
  }).catch((e) => {
    console.error(e)
    error.value = i18n.t("warpsPage.invalidUrl")
    fetching.value = false
  })
}

const clearWarps = () => {
  dialog.show(i18n.t("warpsPage.clear"), i18n.t("warpsPage.clearDialog"), () => {
    warps.warps.splice(0)
    snackbar.show(i18n.t("warpsPage.cleared"))
  })
}

const registerStatusListener = (api: WarpsApi) => {
  const ticketDoc = doc($firestore, "warpHistoryTickets", api.currentTicket!).withConverter(warpHistoryTicketConverter)

  const unsubscribe = onSnapshot(ticketDoc, (snapshot) => {
    const data = snapshot.data()

    if (!data) {
      return
    }

    switch (data.status) {
      case "processing":
        fetchedCount.value = data.count
        break

      case "done":
        warps.warps.push(...data.result!)
        fetching.value = false
        unsubscribe()

        if (data.result!.length === 0) {
          snackbar.show(i18n.t("warpsPage.noNewWarps"))
        }
        break

      case "error":
        fetching.value = false
        snackbar.show(i18n.t(`warpsPage.errors.${data.errorCode}`), "error")
        unsubscribe()
        break
    }
  }, (e) => {
    console.error(e)
    fetching.value = false
    snackbar.show(i18n.t("warpsPage.errors.failedToListen"), "error")
    unsubscribe()
  })
}

</script>
