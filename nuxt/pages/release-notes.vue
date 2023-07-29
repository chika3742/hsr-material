<template>
  <div class="doc-container">
    <section>
      <h2>{{ $t("pageTitles.releaseNotes") }}</h2>

      <v-timeline align="start" side="end">
        <v-timeline-item
          v-for="(item, i) in reversedReleaseNotes"
          :key="i"
          :dot-color="item.funcVersion !== reversedReleaseNotes[i + 1]?.funcVersion ? '#ffc046' : '#40fff8'"
          :size="item.isMajor ? 'default' : 'small'"
        >
          <template #opposite>
            <div v-show="!$vuetify.display.smAndDown" class="changelog-title">
              <span
                v-if="item.funcVersion !== reversedReleaseNotes[i + 1]?.funcVersion"
                class="font-weight-bold"
              >v{{ item.funcVersion }}</span>
              <span
                v-if="item.dataVersion !== reversedReleaseNotes[i + 1]?.dataVersion"
                class="font-weight-bold"
              >D{{ item.dataVersion }}</span>
              <span style="font-size: 0.8em">{{ item.date }}</span>
            </div>
          </template>
          <div class="d-flex flex-column">
            <div
              v-show="$vuetify.display.smAndDown"
              class="changelog-title--mobile"
            >
              <span class="font-weight-bold">{{ getVersionText(item) }}</span>
              <span style="font-size: 0.8em">{{ item.date }}</span>
            </div>
            <div style="font-size: 0.9em; margin-top: -8px" v-html="marked.parse(item.content)" />
          </div>
        </v-timeline-item>
      </v-timeline>
    </section>

    <section>
      <h2>{{ tx("releaseNotesPage.legends") }}</h2>
      <v-table>
        <thead>
          <tr>
            <th>{{ tx("releaseNotesPage.color") }}</th>
            <th>{{ tx("releaseNotesPage.desc") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div style="background: #ffc046; width: 20px; height: 20px; border-radius: 50%" />
            </td>
            <td>{{ tx("releaseNotesPage.orangeDesc") }}</td>
          </tr>
          <tr>
            <td>
              <div style="background: #40fff8; width: 20px; height: 20px; border-radius: 50%" />
            </td>
            <td>{{ tx("releaseNotesPage.lightBlueDesc") }}</td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import releaseNotes from "~/assets/data/release-notes.yaml"
import {ReleaseNote} from "~/types/generated/release-notes.g"

definePageMeta({
  title: "releaseNotes",
})

const {$marked} = useNuxtApp()

const marked = $marked({})

const reversedReleaseNotes = [...releaseNotes].reverse() as ReleaseNote[]
</script>

<style lang="sass">
.changelog-title
  display: flex
  flex-direction: column
  align-items: flex-end

  &--mobile
    display: flex
    flex-direction: column
    padding: 4px 16px
    margin-bottom: 8px
    background: rgb(var(--v-theme-card))
    border-radius: 8px
    width: 250px
    max-width: 250px
</style>
