<script lang="ts" setup>
import _ from "lodash"
import type {PurposeType} from "~/types/strings"
import type {LevelingBookmark} from "~/types/bookmark/bookmark"
import {materialSortFunc} from "~/utils/merge-items"
import {db} from "~/libs/db/providers"

interface Props {
  modelValue: boolean
  items: LevelingBookmark[]
  showFarmingCount?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const snackbar = useSnackbar()
const i18n = useI18n()
const router = useRouter()

const loadingCompleteLeveling = ref<string | null>(null)

const _persistent = ref(false)

const purposes = computed(() => {
  const _purposes: Partial<Record<PurposeType, LevelingBookmark[]>> = {}

  for (const item of props.items) {
    if (item.usage.type === "exp") {
      (_purposes.ascension ||= []).push(item)
    } else {
      (_purposes[item.usage.purposeType] ||= []).push(item)
    }
  }

  const grouped = _.mapValues(_purposes, bookmarks => groupByLevel(bookmarks))

  const sorted = _.mapValues(grouped, levels => _.mapValues(levels, items => items.sort(materialSortFunc)))

  return sorted
})

const groupByLevel = (items: LevelingBookmark[] | undefined): { [purpose: string]: LevelingBookmark[] } => {
  return _.groupBy(items, e => e.usage.upperLevel)
}

const getSkillTitle = (item: LevelingBookmark) => {
  return tx(i18n, `skillTitles.${item.characterId.replace("_", ".")}.${item.usage.purposeType}`)
}

const removeBookmarksInLevel = (purposeType: PurposeType, level: number) => {
  const ids = _.flatMap(purposes.value[purposeType])?.filter(e => e.usage.upperLevel <= level)?.map(e => e.id!)
  if (ids) {
    loadingCompleteLeveling.value = `${purposeType}-${level}`
    return db.bookmarks.remove(...ids).then((result) => {
      snackbar.show(tx(i18n, "bookmark.removed"), null, {
        text: tx(i18n, "common.undo"),
        onClick: () => {
          void db.bookmarks.bulkAdd(result.filter(e => typeof e !== "undefined"))

          // avoid closing dialog
          _persistent.value = true
          setTimeout(() => {
            _persistent.value = false
          }, 0)
        },
      })
      return null
    }).finally(() => {
      loadingCompleteLeveling.value = null
    }).catch((e) => {
      console.error(e)
      snackbar.show(tx(i18n, "errors.bookmark"))
    })
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
    :persistent="_persistent"
    :fullscreen="$vuetify.display.xs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card :title="tx('common.details')">
      <div class="overflow-y-auto pa-2 h-100">
        <v-expansion-panels :model-value="Object.keys(purposes)" multiple>
          <v-expansion-panel
            v-for="(levels, purpose) in purposes"
            :key="purpose"
            :title="tx(`purposeTypes.${purpose}`, {title: getSkillTitle(Object.values(levels!)[0][0])})"
            :value="purpose"
          >
            <template #text>
              <ul>
                <BookmarkDetailsLevel
                  v-for="(_items, level) in levels"
                  :key="level"
                  :items="_items"
                  :level="Number(level)"
                  :loading-level="loadingCompleteLeveling"
                  :purpose="purpose"
                  :show-farming-count="showFarmingCount"
                  @remove-bookmarks-in-level="removeBookmarksInLevel($event.purpose, $event.level)"
                />
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
</style>
