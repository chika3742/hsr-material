<script lang="ts" setup>
import dropRates from "assets/data/drop-rates.yaml"
import materials from "~/assets/data/materials.yaml"
import SwitchListItem from "~/components/switch-list-item.vue"
import { FirestoreProvider } from "~/libs/firestore/firestore-provider"

usePageTitle(tx("pageTitles.settings"))

const config = useConfigStore()
const dialog = useDialog()
const i18n = useI18n()
const snackbar = useSnackbar()

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

const equilibriumLevelPossibleValues = range(0, 6)

const getDropRates = (entry: typeof dropRates[number]) => {
  return entry.drops.find(e => e.equilibriumLevels.includes(config.equilibriumLevel))
}
const getFirstMaterialId = (entry: typeof dropRates[number], rarity: number) => {
  return entry.ids
    ? materials.find(e => entry.ids!.includes(e.id) && e.rarity === rarity)!.id
    : materials.find(e => e.category === entry.type && e.rarity === rarity)!.id
}

const syncFirestore = () => {
  void FirestoreProvider.instance?.sendLocalData()
}

const clearCharacterLevels = () => {
  dialog.show(
    tx(i18n, "settingsPage.others"),
    tx(i18n, "settingsPage.clearCharacterLevelsDesc"),
    () => {
      config.characterLevels = {}
      snackbar.show(tx(i18n, "settingsPage.clearCharacterLevelsSuccess"))
    },
  )
}
</script>

<template>
  <div class="doc-container">
    <section>
      <h2>{{ tx("settingsPage.bookmarkDisplay") }}</h2>
      <v-list
        rounded
        elevation="2"
      >
        <SwitchListItem
          v-model="config.showFarmingCount"
          :title="tx('settingsPage.showFarmingCount')"
          @click="syncFirestore"
        />
        <SwitchListItem
          v-model="config.farmingCountDivision"
          :title="tx('settingsPage.farmingCountDivision')"
          :subtitle="tx('settingsPage.farmingCountDivisionDesc')"
          lines="two"
          :disabled="!config.showFarmingCount"
          @click="syncFirestore"
        />
      </v-list>
    </section>

    <h2>{{ tx("settingsPage.equilibriumLevel") }}</h2>
    <p>{{ tx("settingsPage.equilibriumLevelDesc") }}</p>
    <v-radio-group
      v-model="config.equilibriumLevel"
      hide-details
      inline
      @update:model-value="syncFirestore"
    >
      <v-radio
        v-for="i in equilibriumLevelPossibleValues"
        :key="i"
        :label="i.toString()"
        :value="i"
      />
    </v-radio-group>

    <section>
      <h3>{{ tx("settingsPage.dropRateTable") }}</h3>
      <v-table>
        <thead>
          <tr>
            <th>{{ tx("settingsPage.itemKind") }}</th>
            <th>{{ tx("settingsPage.dropRate") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, i) in dropRates"
            :key="i"
          >
            <td>
              {{
                tx(typeof entry.readableType !== "undefined"
                  ? `settingsPage.itemTypes.${entry.readableType}`
                  : `materialCategories.${entry.type}`)
              }}
            </td>
            <td>
              <client-only>
                <div
                  v-if="getDropRates(entry)"
                  class="d-flex g-4"
                >
                  <div
                    v-for="item in Object.entries(getDropRates(entry)!.rarities)"
                    :key="item[0]"
                    class="d-flex align-center g-2"
                  >
                    <v-img
                      :src="getMaterialImage(getFirstMaterialId(entry, Number(item[0])))"
                      width="35px"
                    />
                    <span>{{ item[1] }}</span>
                  </div>
                </div>
              </client-only>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p>
        <a
          href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRG_cISC2N-_1Lef-GofaydNa-VZ_r9QfnPNnsPNMSw5JHeAu_nLPrOe9ObPM8XmqTMrO5NWGF8L4b3/pubhtml"
          target="_blank"
        >
          {{ tx("settingsPage.dataSource") }}1
        </a>
        <a
          href="https://www.hoyolab.com/article/19515455"
          target="_blank"
        >
          {{ tx("settingsPage.dataSource") }}2
        </a>
      </p>
    </section>

    <section>
      <h2>{{ tx("settingsPage.others") }}</h2>
      <v-list
        class="mt-2"
        elevation="2"
        rounded
      >
        <v-list-item
          :title="tx('settingsPage.clearCharacterLevels')"
          @click="clearCharacterLevels"
        />
      </v-list>
    </section>
  </div>
</template>

<style scoped lang="sass">

</style>
