<script setup lang="ts">
import {DateTime} from "luxon"
import _ from "lodash"
import {getWastedTpCount} from "~/utils/tp"
import {useConfigStore} from "~/store/config"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"

definePageMeta({
  title: "tpCalc",
})

const config = useConfigStore()
const {$marked} = useNuxtApp()
const i18n = useI18n()

const marked = $marked({})

const currentSecond = ref(DateTime.now().second)
onMounted(() => {
  setInterval(() => {
    currentSecond.value = DateTime.now().second
  }, 1000)
})

const validate = (value: string): string | true => {
  const intValue = Number(value)
  return (!isNaN(intValue) && intValue >= 0 && intValue < 180) || i18n.t("tpCalcPage.rangeError")
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
  FirestoreProvider.instance?.sendLocalData()
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

const showWastedTp = ref(false)
</script>

<template>
  <div>
    <!--suppress TypeScriptValidateTypes -->
    <v-text-field
      v-model="currentTpCount"
      class="mb-4"
      :label="$t('tpCalcPage.currentTpCount')"
      style="max-width: 250px"
      :rules="[validate]"
      validate-on="input"
      clearable
      suffix="/ 180"
    />

    <client-only>
      <v-table :key="currentSecond" style="max-width: 500px">
        <tbody>
          <tr>
            <td>{{ $t('tpCalcPage.baseTime') }}</td>
            <td>{{ baseTime.toFormat("MM/dd HH:mm") }} ({{ baseTime.toRelative() }})</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.fullReplenishmentTime') }}</td>
            <td>{{ getTpFullReplenishmentTime(config.tpCount, baseTime)?.toFormat("MM/dd HH:mm") ?? "-" }}</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.remainingTime') }}</td>
            <td>{{ remainingTime }}</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.currentTpCount') }}</td>
            <td>{{ getRealtimeTpCount(config.tpCount, baseTime) }}</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.wastedTp') }}</td>
            <td>
              <v-btn v-if="!showWastedTp" variant="text" @click="showWastedTp = true">
                {{ tx("tpCalcPage.show") }}
              </v-btn>
              <span v-show="showWastedTp">{{ getWastedTpCount(config.tpCount, baseTime) ?? "-" }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <p v-if="remainingTime === '-'" class="text-red">
        {{ $t("tpCalcPage.alreadyReplenished") }}
      </p>
    </client-only>

    <div class="doc-container mt-4" v-html="marked.parse($t('tpCalcPage.howToUse'))" />
  </div>
</template>

<style scoped>

</style>
