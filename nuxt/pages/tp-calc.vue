<script setup lang="ts">
import {DateTime} from "luxon"
import _ from "lodash"
import type {Ref} from "vue"
import {maxTpCount} from "~/utils/tp"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"
import {computed} from "#imports"
import {CustomMarked} from "~/libs/custom-marked"

definePageMeta({
  title: "tpCalc",
})

const config = useConfigStore()
const i18n = useI18n()

const marked = new CustomMarked()

const currentSecond = ref(DateTime.now().second)
onMounted(() => {
  setInterval(() => {
    currentSecond.value = DateTime.now().second
  }, 1000)
})

const validate = (value: string): boolean | string => {
  const intValue = Number(value)
  return (!isNaN(intValue) && intValue >= 0 && intValue < maxTpCount) || i18n.t("tpCalcPage.rangeError", {max: maxTpCount})
}

const currentTpCount = ref(config.tpCount.toString())
watch(currentTpCount, (value: string) => {
  if (validate(value) === true) {
    config.tpCount = Number(value)
    config.tpBaseTime = DateTime.now().toISO()!
    sendToFirestore()
  }
})

const sendToFirestore = _.debounce(() => {
  void FirestoreProvider.instance?.sendLocalData()
}, 1000)

const baseTime = computed(() => {
  return DateTime.fromISO(config.tpBaseTime)
})

const remainingTime = computed(() => {
  const _remainingTime = getTpReplenishmentRemainingTime(config.tpCount, baseTime.value)
  if (_remainingTime === null) {
    return "-"
  }
  return i18n.t("tpCalcPage.duration", _remainingTime.shiftToAll().toObject() as Record<string, number>)
})

interface TableDataItem {
  label: string
  value: string | number
  isShownRef?: Ref<boolean>
}

const getTableData = (): TableDataItem[] => ([
  {
    label: i18n.t("tpCalcPage.baseTime"),
    value: baseTime.value.toFormat("MM/dd HH:mm") + " (" + baseTime.value.toRelative({locale: i18n.locale.value}) + ")",
  },
  {
    label: i18n.t("tpCalcPage.fullReplenishmentTime"),
    value: getTpFullReplenishmentTime(config.tpCount, baseTime.value)?.toFormat("MM/dd HH:mm") ?? "-",
  },
  {
    label: i18n.t("tpCalcPage.remainingTime"),
    value: remainingTime.value,
  },
  {
    label: i18n.t("tpCalcPage.currentTpCount"),
    value: getRealtimeTpCount(config.tpCount, baseTime.value),
  },
  {
    label: i18n.t("tpCalcPage.reservedTp"),
    value: getReservedTpCount(config.tpCount, baseTime.value) ?? "-",
  },
])
</script>

<template>
  <div>
    <v-text-field
      v-model="currentTpCount"
      class="mb-4"
      :label="$t('tpCalcPage.currentTpCount')"
      style="max-width: 250px"
      :rules="[validate]"
      validate-on="input"
      clearable
      :suffix="`/ ${maxTpCount}`"
    />

    <v-table style="max-width: 500px">
      <tbody>
        <tr v-for="(item, i) in getTableData()" :key="i">
          <td>{{ item.label }}</td>
          <td>
            <v-btn v-if="item.isShownRef && !item.isShownRef.value" variant="text" @click="item.isShownRef.value = true">
              {{ tx("tpCalcPage.show") }}
            </v-btn>
            <span v-show="!item.isShownRef || item.isShownRef.value" :key="currentSecond">
              <client-only>
                {{ item.value }}
              </client-only>
            </span>
          </td>
        </tr>
      </tbody>
    </v-table>

    <p v-show="remainingTime === '-'" class="text-red">
      {{ $t("tpCalcPage.alreadyReplenished") }}
    </p>

    <div class="doc-container mt-4" v-html="marked.parse($t('tpCalcPage.howToUse'))" />
  </div>
</template>

<style scoped>

</style>
