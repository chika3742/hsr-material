<template>
  <div class="doc-container">
    <section>
      <h2>{{ $t("pageTitles.releaseNotes") }}</h2>

      <div class="mt-4">
        <v-progress-circular v-if="pending" indeterminate />
      </div>

      <v-timeline v-if="data" align="start" side="end">
        <v-timeline-item
          v-for="(item, i) in data"
          :key="i"
          :dot-color="item.tag_name.startsWith('v') ? '#ffc046' : '#40fff8'"
        >
          <template #opposite>
            <div v-show="!$vuetify.display.smAndDown" class="changelog-title">
              <span class="font-weight-bold">{{ item.tag_name }}</span>
              <span style="font-size: 0.8em">{{ DateTime.fromISO(item.published_at).toFormat("yyyy/MM/dd") }}</span>
            </div>
          </template>
          <div class="d-flex flex-column">
            <div
              v-show="$vuetify.display.smAndDown"
              class="changelog-title--mobile"
            >
              <span class="font-weight-bold">{{ item.tag_name }}</span>
              <span style="font-size: 0.8em">{{ DateTime.fromISO(item.published_at).toFormat("yyyy/MM/dd") }}</span>
            </div>
            <div style="font-size: 0.9em" v-html="marked.parse(item.body)" />
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
import {Ref} from "vue"
import {DateTime} from "luxon"

definePageMeta({
  title: "releaseNotes",
})

const {$marked} = useNuxtApp()

const marked = $marked({})

const {data: _data, pending} = useLazyFetch("https://api.github.com/repos/chika3742/hsr-material/releases")
const data = _data as Ref<{
  tag_name: string
  published_at: string
  body: string
}[] | null>
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
