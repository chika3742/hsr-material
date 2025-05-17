<template>
  <div>
    <v-row
      class="cards"
      no-gutters
      style="gap: 16px"
    >
      <v-card>
        <div class="card">
          <h4>{{ i18n.t("warpsPage.pityCountWithStar", { star: "5" }) }}</h4>
          <div class="card__content">
            <span
              :class="pityInfo[5].count > pseudoPityBorder
                ? 'text-red' : pityInfo[5].count > pseudoPityBorder - 10
                  ? 'text-orange-darken-2' : ''"
            >{{ pityInfo[5].count }}</span> / {{ star5Pity }}
          </div>
        </div>
        <div class="card__bar card__bar--rank5" />
      </v-card>

      <v-card>
        <div class="card">
          <h4>{{ i18n.t("warpsPage.lastPulled", { star: "5" }) }}</h4>
          <div class="card__content">
            {{ $t(pityInfo[5].lastPulled) }}
          </div>
        </div>
        <div class="card__bar card__bar--rank5" />
      </v-card>

      <v-card>
        <div class="card">
          <h4>{{ i18n.t("warpsPage.pityCountWithStar", { star: "4" }) }}</h4>
          <div class="card__content">
            <span>{{ pityInfo[4].count }}</span> / {{ star4Pity }}
          </div>
        </div>
        <div class="card__bar card__bar--rank4" />
      </v-card>

      <v-card>
        <div class="card">
          <h4>{{ i18n.t("warpsPage.lastPulled", { star: "4" }) }}</h4>
          <div class="card__content">
            {{ $t(pityInfo[4].lastPulled) }}
          </div>
        </div>
        <div class="card__bar card__bar--rank4" />
      </v-card>

      <v-card>
        <div class="card">
          <h4>{{ i18n.t("warpsPage.prob") }}</h4>
          <div class="card__content">
            <span>{{ (rank5Prob * 100).toFixed(2) }}</span>%
          </div>
        </div>
        <div class="card__bar card__bar--rank5" />
      </v-card>
    </v-row>

    <v-expansion-panels
      v-if="showPityHistory"
      class="mt-4"
      style="max-width: 800px"
    >
      <v-expansion-panel>
        <v-expansion-panel-title>{{ $t("warpsPage.pityHistory") }}</v-expansion-panel-title>
        <v-expansion-panel-text class="pity-history-container">
          <v-chip-group
            v-model="filter"
            class="mx-2"
            column
            multiple
            filter
            mandatory
            color="primary"
          >
            <v-chip
              text="☆3"
              value="3"
            />
            <v-chip
              text="☆4"
              value="4"
            />
            <v-chip
              text="☆5"
              value="5"
            />
          </v-chip-group>
          <p class="my-0 opacity-70 text-caption text-center d-md-none">
            左右にスクロールできます
          </p>
          <v-table style="white-space: nowrap">
            <thead>
              <tr>
                <th>{{ $t("warpsPage.rarity") }}</th>
                <th>{{ $t("warpsPage.itemName") }}</th>
                <th>{{ $t("warpsPage.pityCount") }}</th>
                <th>{{ $t("warpsPage.dateTime") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in pityCountList"
                :key="i"
              >
                <td>
                  <v-row
                    :class="{ 'text-blue': item.rank === '3', 'text-orange': item.rank === '4', 'text-red': item.rank === '5', 'flex-nowrap': true }"
                    align="center"
                    no-gutters
                  >
                    <v-icon>
                      mdi-star
                    </v-icon>
                    <span>{{ item.rank }}</span>
                  </v-row>
                </td>
                <td style="min-width: 150px">
                  <v-row
                    no-gutters
                    align="center"
                    class="flex-nowrap"
                  >
                    <v-icon>{{ item.type === "キャラクター" ? "mdi-account" : "mdi-sword" }}</v-icon>
                    <span class="ml-1">{{ item.name }}</span>
                    <v-icon
                      v-if="item.offBanner"
                      class="ml-1"
                    >
                      mdi-emoticon-sad
                    </v-icon>
                  </v-row>
                </td>
                <td
                  :class="getTableNumberColorClass(item)"
                >
                  {{ item.count ?? "-" }}
                </td>
                <td>
                  {{ item.dateTime.toFormat("yyyy/MM/dd HH:mm") }}
                  ({{ item.dateTime.toRelative({ locale: $i18n.locale }) }})
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from "luxon"
import type { Warp } from "#shared/warp"
import characters from "~/assets/data/characters.yaml"
import lightCones from "~/assets/data/light-cones.yaml"

const props = defineProps<{
  warps: Warp[]
  star5Pity: number
  singleProb: number
  pseudoPityBorder: number
  showPityHistory: boolean
}>()

interface PityCountListItem {
  rank: string
  type: string
  name: string
  count: number | null
  offBanner?: boolean
  dateTime: DateTime
}

const i18n = useI18n()

const filter = ref<string[]>(["4", "5"])

const star4Pity = 10
const offBannerItems = [
  "姫子",
  "ヴェルト",
  "ブローニャ",
  "ジェパード",
  "クラーラ",
  "彦卿",
  "白露",
  "かけがえのないもの",
  "泥の如き眠り",
  "銀河鉄道の夜",
  "だが戦争は終わらない",
  "世界の名を以て",
  "勝利の刹那",
  "時節は居らず",
]

const pityInfo = computed<Record<number, { count: number, lastPulled: string }>>(() => {
  const pityInfo: Record<number, { count: number, lastPulled: string }> = {
    5: {
      count: props.warps.length,
      lastPulled: "-",
    },
    4: {
      count: props.warps.length,
      lastPulled: "-",
    },
  }

  for (let i = 0; i < props.warps.length; i++) {
    const warp = props.warps[props.warps.length - 1 - i]

    if (pityInfo[5].lastPulled === "-" && warp.rankType === "5") {
      pityInfo[5] = {
        count: i,
        lastPulled: getItemName(warp),
      }
    } else if (pityInfo[4].lastPulled === "-" && warp.rankType === "4") {
      pityInfo[4] = {
        count: i,
        lastPulled: getItemName(warp),
      }
    }

    if (Object.values(pityInfo).every(info => info.count !== props.warps.length)) {
      break
    }
  }

  return pityInfo
})

const pityCountList = computed(() => {
  const result: PityCountListItem[] = []

  const pityCount: Record<string, number> = {}
  for (const rank of filter.value) {
    pityCount[rank] = 0
  }

  for (const warp of props.warps) {
    for (const key of Object.keys(pityCount)) {
      pityCount[key]++
    }

    if (Object.keys(pityCount).includes(warp.rankType)) {
      result.push({
        name: getItemName(warp),
        type: warp.itemType,
        count: warp.rankType !== "3" ? pityCount[warp.rankType] : null,
        offBanner: warp.gachaType !== "1" && offBannerItems.includes(getItemName(warp)),
        dateTime: DateTime.fromFormat(warp.time, "yyyy-MM-dd HH:mm:ss"),
        rank: warp.rankType,
      })
      pityCount[warp.rankType] = 0
    }
  }

  return result.reverse()
})

const getItemName = (warp: Warp) => {
  switch (warp.itemType) {
    case "キャラクター": {
      const found = characters.find(e => e.name.locales.ja === warp.name)
      if (!found) {
        console.error(`Character not found: ${warp.name}`)
        return "?"
      }
      return localize(found.name, i18n)
    }
    case "光円錐": {
      const found = lightCones.find(e => e.name.locales.ja === warp.name)
      if (!found) {
        console.error(`Light cone not found: ${warp.name}`)
        return "?"
      }
      return localize(found.name, i18n)
    }
  }
}

const getTableNumberColorClass = (item: PityCountListItem) => {
  if (!item.count) {
    return ""
  }

  if (item.rank === "4") {
    if (item.count >= 10) {
      return "text-red"
    } else {
      return "text-green"
    }
  } else if (item.rank === "5") {
    if (item.count > props.pseudoPityBorder) {
      return "text-red"
    } else {
      return "text-green"
    }
  } else {
    return ""
  }
}

const rank5Prob = computed(() => {
  const trial = pityInfo.value[5].count + 10

  if (trial <= props.pseudoPityBorder) {
    return 1 - Math.pow(1 - props.singleProb, trial)
  } else {
    let prob = Math.pow(1 - props.singleProb, props.pseudoPityBorder)
    for (let i = 1; i <= trial - props.pseudoPityBorder; i++) {
      prob *= 1 - (0.06 * i)
    }
    return 1 - prob
  }
})
</script>

<style lang="sass" scoped>
.cards
  .card
    padding: 8px 16px

    h4
      font-weight: normal
      font-size: 0.9rem

    &__content
      text-align: center
      font-size: 1.1rem
      font-weight: bold
      margin-top: 4px

      span
        font-size: 1.8rem
        margin-right: 4px
        font-family: "Cairo", "M PLUS 2", sans-serif

    &__bar
      height: 4px
      width: 100%
      position: absolute
      bottom: 0

      &--rank5
        background-color: rgb(var(--v-theme-rarity-5))

      &--rank4
        background-color: rgb(var(--v-theme-rarity-4))
</style>

<style lang="sass">
.pity-history-container .v-expansion-panel-text__wrapper
  padding-left: 0
  padding-right: 0
</style>
