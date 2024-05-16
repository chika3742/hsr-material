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
            v-model="config.warpsShowPityList"
            :disabled="warps.length > 0 || fetching"
            :label="$t('warpsPage.getPityHistory')"
            color="primary"
            density="compact"
            hide-details
          />
          <div style="font-size: 0.9em">
            {{ $t('warpsPage.getPityHistoryDesc') }}
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
            fetchProgress !== null ? i18n.t("warpsPage.progress", fetchProgress) : $t('warpsPage.preparing')
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
          :show-pity-history="config.warpsShowPityList"
          :warps="groupedWarps[warpType.type] ?? []"
          class="my-2"
        />
      </section>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {doc, onSnapshot} from "@firebase/firestore"
import {from, useObservable} from "@vueuse/rxjs"
import {liveQuery} from "dexie"
import _ from "lodash"
import type {Warp} from "#shared/warp"
import type {WarpGettingProgress} from "#shared/warp-history-ticket"
import {ref} from "#imports"
import {WarpsApi} from "~/libs/warps-api"
import {warpHistoryTicketConverter} from "~/utils/warp-history-ticket-converter"
import {_db} from "~/dexie/db"
import {db} from "~/libs/db/providers"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"

definePageMeta({
  title: "warps",
})

const config = useConfigStore()
const i18n = useI18n()
const snackbar = useSnackbar()
const dialog = useDialog()
const {$functions, $firestore} = useNuxtApp()

const url = ref(config.warpsUrl)
const error = ref("")
const fetchProgress = ref<WarpGettingProgress | null>(null)
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

const warps = process.client
  ? useObservable<Warp[], Warp[]>(from(liveQuery(() => _db.warps.toArray())), {
    initialValue: [],
  })
  : ref([])

const groupedWarps = computed(() => {
  return _.groupBy(warps.value, "gachaType") as Record<string, Warp[]>
})

const getWarps = async() => {
  fetchProgress.value = null
  error.value = ""
  fetching.value = true

  const api = new WarpsApi($functions, url.value)

  try {
    const validationResult = await api.validateUrl()

    if (!validationResult.valid) {
      error.value = tx(i18n, `warpsPage.errors.${validationResult.errorCode}`)
      fetching.value = false
      return
    }
  } catch (e) {
    console.error(e)
    fetching.value = false
    error.value = tx(i18n, "warpsPage.errors.internal")
    return
  }

  api.createTicket(await db.warps.getLastIds(warpTypes.map(e => e.type)), !config.warpsShowPityList).then(() => {
    config.warpsUrl = url.value

    registerStatusListener(api)
    return null
  }).catch((e) => {
    console.error(e)
    fetching.value = false
    error.value = i18n.t("warpsPage.errors.internal")
  })
}

const clearWarps = () => {
  dialog.show(tx(i18n, "warpsPage.clear"), tx(i18n, "warpsPage.clearDialog"), () => {
    db.warps.clear().then(() => {
      snackbar.show(tx(i18n, "warpsPage.cleared"))
      return null
    }).catch((e) => {
      console.error(e)
      snackbar.show(tx(i18n, "warpsPage.clearError"), "error")
    })
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
        fetchProgress.value = data.progress
        break

      case "done":
        unsubscribe()
        db.warps.add(...data.result!).then(() => {
          if (data.result!.length === 0) {
            snackbar.show(i18n.t("warpsPage.noNewWarps"))
          } else {
            snackbar.show(i18n.t("warpsPage.fetched", data.result!.length))
          }
          return null
        }).finally(() => {
          fetching.value = false
        }).catch((e) => {
          console.error(e)
          snackbar.show(i18n.t("warpsPage.errors.failedToSave"), "error")
        })
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

watch(toRefs(config).warpsShowPityList, () => {
  void FirestoreProvider.instance?.sendLocalData()
})
// `warpsUrl` is sent when fetching warps is complete

</script>
