<script setup lang="ts">
import { Marked } from "marked"
import { tx } from "../../utils/i18n"
import { computed, ref } from "#imports"

interface Props {
  releaseNotes: ReleaseNote[]
}

defineProps<Props>()

const marked = new Marked()

const timelineExpanded = ref(false)
const timeline = ref<{ $el: HTMLElement } | null>(null)

const timelineStyle = computed(() => {
  if (!timeline.value) {
    return "max-height: 600px"
  } // fallback

  if (timeline.value.$el.scrollHeight < 600) { // if content is less than 600px
    return ""
  }

  if (timelineExpanded.value) { // expanded
    return `height: ${timeline.value.$el.scrollHeight}px`
  }
  return "max-height: 600px; height: 600px" // collapsed
})
</script>

<template>
  <div class="doc-container">
    <section>
      <h2>{{ $t("pageTitles.releaseNotes") }}</h2>

      <v-timeline
        ref="timeline"
        :style="timelineStyle"
        align="start"
        class="timeline"
        side="end"
      >
        <v-timeline-item
          v-for="(item, i) in releaseNotes"
          :key="i"
          :dot-color="item.funcVersion !== releaseNotes[i + 1]?.funcVersion ? '#ffc046' : '#40fff8'"
          :size="item.isMajor ? 'default' : 'small'"
        >
          <template #opposite>
            <ReleaseNoteVersionHeading
              v-show="!$vuetify.display.smAndDown"
              :item="item"
              :previous-item="releaseNotes[i + 1]"
              class="changelog-title"
            />
          </template>
          <div class="d-flex flex-column">
            <ReleaseNoteVersionHeading
              v-show="$vuetify.display.smAndDown"
              class="changelog-title--mobile"
              :item="item"
              :previous-item="releaseNotes[i + 1]"
            />
            <div
              style="font-size: 0.9em; margin-top: -8px"
              v-html="marked.parse(item.content)"
            />
          </div>
        </v-timeline-item>

        <div
          v-show="!timelineExpanded && timeline && timeline.$el.scrollHeight >= 600"
          class="show-more-blur"
        >
          <v-btn
            class="mb-4 show-more-blur__btn"
            color="primary"
            variant="flat"
            width="200px"
            @click="timelineExpanded = true"
          >
            すべて表示
          </v-btn>
        </div>
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

.timeline
  overflow: hidden
  padding: 0 16px
  transition: height 300ms ease

.show-more-blur
  position: absolute
  width: 100%
  bottom: 0
  height: 150px
  display: flex
  justify-content: center
  align-items: flex-end

  &__btn
    z-index: 2

  &::before
    content: ""
    position: absolute
    width: 100%
    height: 100%
    z-index: 1
    backdrop-filter: blur(4px)
    mask: linear-gradient(to bottom, transparent 0%, black 50%)
</style>
