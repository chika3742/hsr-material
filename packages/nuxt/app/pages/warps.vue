<template>
  <div class="doc-container">
    <v-banner
      class="mb-4"
      icon="mdi-alert"
      color="error"
    >
      <template #text>
        <p class="font-weight-bold">
          {{ $t("warpsPage.banner") }}
        </p>
      </template>
      <template #actions>
        <v-btn
          base-color="primary"
          href="https://gc.chikach.net"
          target="_blank"
        >
          {{ $t("warpsPage.tryItOut") }}
        </v-btn>
      </template>
    </v-banner>

    <client-only>
      <section>
        <v-row
          no-gutters
          style="gap: 16px"
          justify="end"
        >
          <v-spacer />
          <v-btn
            :disabled="warps.length === 0"
            prepend-icon="mdi-download"
            @click="exportWarps"
          >
            {{ $t("warpsPage.export") }}
          </v-btn>
          <v-btn @click="clearWarps">
            {{ $t("warpsPage.clear") }}
          </v-btn>
        </v-row>
      </section>
    </client-only>

    <client-only>
      <section
        v-for="warpType in warpTypes"
        :key="warpType.type"
      >
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
import { from, useObservable } from "@vueuse/rxjs"
import { liveQuery } from "dexie"
import { groupBy } from "lodash-es"
import { ref } from "#imports"
import { _db } from "~/dexie/db"
import { db } from "~/libs/db/providers"
import { FirestoreProvider } from "~/libs/firestore/firestore-provider"
import { buildWarpExport, downloadWarpExport } from "~/utils/warp-export"
import type { Warp } from "~/types/warp"

usePageTitle(tx("pageTitles.warps"))

const config = useConfigStore()
const i18n = useI18n()
const snackbar = useSnackbar()
const dialog = useDialog()

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
    type: "21",
    title: i18n.t("warpsPage.warpTypes.21"),
    star5Pity: 90,
    pseudoPityBorder: 73,
    singleProb: 0.006,
  },
  {
    type: "12",
    title: i18n.t("warpsPage.warpTypes.12"),
    star5Pity: 80,
    pseudoPityBorder: 63,
    singleProb: 0.008,
  },
  {
    type: "22",
    title: i18n.t("warpsPage.warpTypes.22"),
    star5Pity: 80,
    pseudoPityBorder: 63,
    singleProb: 0.008,
  },
  {
    type: "1",
    title: i18n.t("warpsPage.warpTypes.1"),
    star5Pity: 90,
    pseudoPityBorder: 73,
    singleProb: 0.006,
  },
]

const warps = import.meta.client
  ? useObservable<Warp[], Warp[]>(from(liveQuery(() => _db.warps.toArray())), {
      initialValue: [],
    })
  : ref([])

const groupedWarps = computed(() => {
  return groupBy(warps.value, "gachaType") as Record<string, Warp[]>
})

const exportWarps = () => {
  const data = buildWarpExport(groupedWarps.value, warpTypes)
  downloadWarpExport(data)
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

watch(toRefs(config).warpsShowPityList, () => {
  void FirestoreProvider.instance?.sendLocalData()
})
// `warpsUrl` is sent when fetching warps is complete
</script>
