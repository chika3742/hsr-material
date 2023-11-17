<script lang="ts" setup>
import relicStats from "assets/data/relic-stats.yaml"
import type {RelicPiece, RelicSet} from "~/types/data/relics"
import type {Stat} from "~/types/generated/relic-stats.g"
import type {CharacterIdWithVariant} from "~/types/strings"
import {db} from "~/libs/db/providers"
import type {BookmarkableRelic} from "~/types/bookmark/bookmarkables"
import {BookmarkableRelicPiece, BookmarkableRelicSet} from "~/types/bookmark/bookmarkables"

interface Props {
  modelValue: boolean
  relicSets: RelicSet[] | null
  relicPiece: RelicPiece | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const i18n = useI18n()
const snackbar = useSnackbar()

interface HeaderRelic {
  title: string
  subtitle?: string
  image: string
}

const headerRelics = computed<HeaderRelic[]>(() => {
  if (props.relicSets) {
    let type: string
    switch (props.relicSets.length) {
      case 1:
        if (props.relicSets[0].type === "cavern") {
          type = "4pcs"
        } else {
          type = "2pcs"
        }
        break
      case 2:
        type = "2pcs"
        break
      default:
        throw new Error("Invalid relic set count")
    }

    return props.relicSets.map(e => ({
      title: tx(`relicSetTitles.${e.id}`) + " (" + tx(`relicDetailsPage.${type}`) + ")",
      image: getRelicSetImage(e.id),
    }))
  } else {
    // single relic piece
    return [
      {
        title: tx(`relicPieceNames.${props.relicPiece!.id}`),
        subtitle: tx(`relicLocations.${props.relicPiece!.type}`),
        image: getRelicPieceImage(props.relicPiece!.id),
      },
    ]
  }
})

interface RadioGroup {
  type: string
  title: string
  items: Stat[]
}

const radioGroups = computed<RadioGroup[]>(() => {
  if (props.relicSets) {
    if (props.relicSets.length === 0 || props.relicSets.length >= 3) {
      throw new Error("Invalid relic set count")
    }

    if (props.relicSets[0].type === "cavern") {
      return [
        {
          type: "body",
          title: "relicDetailsPage.mainStatBody",
          items: relicStats.main.body,
        },
        {
          type: "feet",
          title: "relicDetailsPage.mainStatFeet",
          items: relicStats.main.feet,
        },
      ]
    } else {
      return [
        {
          type: "planar_sphere",
          title: "relicDetailsPage.mainStatPlanarSphere",
          items: relicStats.main.planar_sphere,
        },
        {
          type: "link_rope",
          title: "relicDetailsPage.mainStatLinkRope",
          items: relicStats.main.link_rope,
        },
      ]
    }
  } else if (props.relicPiece) {
    return [
      {
        type: "piece",
        title: "relicDetailsPage.mainStat",
        items: relicStats.main[props.relicPiece.type],
      },
    ]
  }

  throw new Error("Relic set or relic piece must be provided")
})

const selectedCharacter = ref<CharacterIdWithVariant>()
const selectedStats = reactive({
  main: {} as Record<string, Stat | null>,
  sub: [] as Stat[],
})
watch(toRefs(props).modelValue, (value) => {
  if (value) {
    initSelections()
  }
})

const characterSelectError = ref("")
const loading = ref(false)

const initSelections = () => {
  selectedStats.main = Object.fromEntries(radioGroups.value.map(e => [e.type, null]))
  selectedStats.sub = []
}

const saveBookmark = async() => {
  if (typeof selectedCharacter.value === "undefined") {
    characterSelectError.value = tx(i18n, "relicDetailsPage.characterSelectError")
    return
  }

  const data: BookmarkableRelic = (() => {
    if (props.relicSets) {
      return new BookmarkableRelicSet({
        relicSetIds: props.relicSets.map(e => e.id),
        characterId: selectedCharacter.value,
        mainStats: toRaw(selectedStats.main),
        subStats: toRaw(selectedStats.sub),
      })
    } else {
      return new BookmarkableRelicPiece({
        relicPieceId: props.relicPiece!.id,
        characterId: selectedCharacter.value,
        mainStat: selectedStats.main.piece!,
        subStats: toRaw(selectedStats.sub),
      })
    }
  })()

  loading.value = true
  try {
    await db.bookmarks.addRelic(data)

    emit("update:modelValue", false)
    snackbar.show(tx(i18n, "bookmark.bookmarked"))
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "errors.bookmark"), "error")
  } finally {
    loading.value = false
  }
}

const getIsRadioButtonDisabled = (stat: Stat): boolean => {
  if (props.relicSets) {
    return false
  }

  return selectedStats.sub.includes(stat)
}

const getCheckBoxDisabled = (stat: Stat): boolean => {
  if (props.relicSets) {
    return false
  }

  return selectedStats.main.piece === stat || (selectedStats.sub.length >= 4 && !selectedStats.sub.includes(stat))
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="!$vuetify.display.xs ? '600px' : ''"
    :fullscreen="$vuetify.display.xs"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card
      v-safe-area
      :title="relicSets ? tx('relicDetailsPage.bookmarkRelicSet') : tx('relicDetailsPage.bookmarkRelicPiece')"
    >
      <template #text>
        <div>
          <!-- Relic set view -->
          <v-list-item
            v-for="(item, i) in headerRelics"
            :key="i"
            :prepend-avatar="item.image"
            :title="item.title"
            :subtitle="item.subtitle"
          />

          <!-- Character select -->
          <CharacterSelect
            v-model="selectedCharacter"
            v-model:error="characterSelectError"
            :characters="$characterSelectItems"
            :label="tx('relicDetailsPage.characterToEquip')"
          />

          <!-- Main stat radio buttons -->
          <section v-for="group in radioGroups.filter(e => e.items.length >= 2)" :key="group.title">
            <h4>{{ tx(group.title) }}</h4>
            <v-radio-group v-model="selectedStats.main[group.type]" inline>
              <v-radio :label="tx('relicDetailsPage.unspecified')" :value="null" />
              <v-radio
                v-for="stat in group.items"
                :key="stat"
                :disabled="getIsRadioButtonDisabled(stat)"
                :label="tx(`stats.${stat}`)"
                :value="stat"
              />
            </v-radio-group>
          </section>

          <!-- Sub stat checkboxes -->
          <section>
            <h4>{{ tx("common.subStat", {n: 0}) }}</h4>
            <v-row no-gutters>
              <v-checkbox-btn
                v-for="stat in relicStats.sub"
                :key="stat"
                v-model="selectedStats.sub"
                :label="tx(`stats.${stat}`)"
                :value="stat"
                :disabled="getCheckBoxDisabled(stat)"
                inline
              />
            </v-row>
          </section>
        </div>
      </template>

      <template #actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          {{ tx("common.cancel") }}
        </v-btn>
        <v-btn :loading="loading" variant="text" @click="saveBookmark">
          {{ tx("common.ok") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="sass" scoped>

</style>
