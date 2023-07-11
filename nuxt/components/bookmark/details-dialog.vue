<script lang="ts" setup>
import {groupBy} from "lodash"
import {isBookmarkableExp} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"
import {Bookmark, LevelingBookmark} from "~/types/bookmark/bookmark"
import {materialSortFunc} from "~/utils/merge-items"
import {db} from "~/libs/db/providers"

interface Props {
  modelValue: boolean
  items: LevelingBookmark[]
  bookmarks: Bookmark[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const snackbar = useSnackbar()
const i18n = useI18n()
const router = useRouter()

const purposes = computed(() => {
  const result: Partial<Record<PurposeType, LevelingBookmark[]>> = {}

  for (const item of props.items) {
    if (item.usage.type === "exp") {
      (result.ascension ||= []).push(item)
    } else {
      (result[item.usage.purposeType] ||= []).push(item)
    }
  }

  return result
})

const getSkillTitle = (item: LevelingBookmark) => {
  return tx(i18n, `skillTitles.${toCharacterIdWithVariant(item.usage.characterId, item.usage.variant).replace("_", ".")}.${item.usage.purposeType}`)
}

const removeBookmarksInLevel = (purposeType: PurposeType, level: number) => {
  const ids = purposes.value[purposeType]?.filter(e => e.usage.upperLevel <= level)?.map(e => e.id!)
  if (ids) {
    db.bookmarks.remove(...ids)
    snackbar.show(tx(i18n, "bookmark.removed"))
  }
}

router.beforeEach(() => {
  emit("update:modelValue", false)
})
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    scrollable
    :fullscreen="$vuetify.display.xs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card :title="tx('common.details')">
      <div class="overflow-y-auto pa-2 h-100">
        <v-expansion-panels :model-value="Object.keys(purposes)" multiple>
          <v-expansion-panel
            v-for="(_items, purpose) in purposes"
            :key="purpose"
            :title="tx(`purposeTypes.${purpose}`, {title: getSkillTitle(_items![0])})"
            :value="purpose"
          >
            <template #text>
              <ul>
                <li v-for="(__items, lv) in groupBy(_items, (e) => e.usage.upperLevel)" :key="lv">
                  <v-row align="center" class="mb-2" no-gutters>
                    <h3 class="text-slight-heading">
                      Lv. {{ lv }}
                    </h3>
                    <v-btn
                      :disabled="!bookmarks.some(e => __items.some(e2 => e2.id === e.id))"
                      class="ml-1"
                      prepend-icon="mdi-marker-check"
                      variant="text"
                      @click="removeBookmarksInLevel(purpose, parseInt(lv))"
                    >
                      <span>{{ tx('bookmark.completeLeveling') }}</span>

                      <!-- complete leveling button hint -->
                      <v-tooltip activator="parent" location="bottom" open-delay="200">
                        <span>{{ tx("bookmark.completeLevelingDesc") }}</span>
                      </v-tooltip>
                    </v-btn>
                  </v-row>
                  <div class="material-cards-container">
                    <MaterialCard
                      v-for="item in __items.sort(materialSortFunc)"
                      :key="item.id"
                      :initial-selected-exp-item="isBookmarkableExp(item) ? item.selectedItem : undefined"
                      :items="[item]"
                      :purpose-types="[purpose]"
                      individual
                    />
                  </div>
                </li>
              </ul>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click.prevent="$emit('update:modelValue', false)">
          {{ tx('common.cancel') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="sass" scoped>
h2
  font-size: 1.2em

ul
  display: flex
  flex-direction: column
  gap: 8px
  list-style: none

  li
    .material-cards-container
      display: flex
      flex-wrap: wrap
      gap: 8px
</style>
