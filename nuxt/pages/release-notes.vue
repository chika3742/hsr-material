<template>
  <div class="doc-container">
    <section>
      <h2>{{ $t("pageTitles.releaseNotes") }}</h2>

      <v-timeline align="start" side="end">
        <v-timeline-item
          v-for="(item, i) in releaseNotes"
          :key="i"
          :dot-color="item.funcVersion !== releaseNotes[i + 1]?.funcVersion ? '#ffc046' : '#40fff8'"
          :size="item.isMajor ? 'default' : 'small'"
        >
          <template #opposite>
            <div v-show="!$vuetify.display.smAndDown" class="changelog-title">
              <span class="font-weight-bold">{{ getVersionText(item) }}</span>
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
            <div style="font-size: 0.9em" v-html="marked.parse(item.content)" />
          </div>
        </v-timeline-item>
      </v-timeline>
    </section>

    <section>
      <h2>凡例</h2>
      <v-table>
        <thead>
          <tr>
            <th>カラー</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>オレンジ</td>
            <td>機能関連の更新を含みます</td>
          </tr>
          <tr>
            <td>水色</td>
            <td>キャラ・武器等のデータ追加のみの更新です</td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import releaseNotes from "~/assets/data/release-notes.yaml"

definePageMeta({
  title: "releaseNotes",
})

const {$marked} = useNuxtApp()

const marked = $marked({})
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
