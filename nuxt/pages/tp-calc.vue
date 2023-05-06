<script setup lang="ts">
import {DateTime} from "luxon"
import {useConfigStore} from "~/store/config"

definePageMeta({
  title: "tpCalc",
})

const config = useConfigStore()
const {$marked} = useNuxtApp()
const i18n = useI18n()

const marked = $marked({})

const error = ref("")

const onValueUpdate = (value: number) => {
  const intValue = Number(value)
  if (isNaN(intValue) || intValue < 0 || intValue >= 180) {
    error.value = i18n.t("tpCalcPage.rangeError")
    return
  }
  error.value = ""
  config.tpBaseTime = DateTime.now().toISOTime()!
}

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
</script>

<template>
  <div>
    <!--suppress TypeScriptValidateTypes -->
    <v-text-field
      v-model="config.tpCount"
      class="mb-4"
      :label="$t('tpCalcPage.currentTpCount')"
      :error-messages="error"
      style="max-width: 250px"
      suffix="/ 180"
      @update:model-value="onValueUpdate"
    />

    <client-only>
      <v-table style="max-width: 500px">
        <tbody>
          <tr>
            <td>{{ $t('tpCalcPage.baseTime') }}</td>
            <td>{{ baseTime.toFormat("MM/dd HH:mm") }}</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.fullReplenishmentTime') }}</td>
            <td>{{ getTpFullReplenishmentTime(config.tpCount, baseTime)?.toFormat("MM/dd HH:mm") ?? "-" }}</td>
          </tr>
          <tr>
            <td>{{ $t('tpCalcPage.remainingTime') }}</td>
            <td>{{ remainingTime }}</td>
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
