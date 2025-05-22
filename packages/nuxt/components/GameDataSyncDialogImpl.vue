<script setup lang="ts">
import { DateTime } from "luxon"
import lightCones from "~/assets/data/light-cones.yaml"
import { db } from "~/libs/db/providers"
import type { ShowcaseResponse } from "~/types/showcase-response"

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: "update:modelValue", value: boolean): void
}
const emit = defineEmits<Emits>()

const snackbar = useSnackbar()
const config = useConfigStore()
const i18n = useI18n()
const pTimer = usePeriodicTimer(() => {
  if (fetchAvailableAfter.value === null) {
    pTimer.stop()
    return
  }
  fetchAvailableInSeconds.value = Math.round(fetchAvailableAfter.value.diffNow().as("seconds"))
  if (fetchAvailableInSeconds.value <= 0) {
    fetchAvailableInSeconds.value = null
    fetchAvailableAfter.value = null
    pTimer.stop()
  }
}, 1000, true)

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    showcaseUid.value = config.uid
  }
})

const showcaseUid = ref("")
const showcaseResponse = ref<ShowcaseResponse | null>(null)
const loadingShowcaseUser = ref(false)
const fetchAvailableAfter = ref<DateTime | null>(null)
const fetchAvailableInSeconds = ref<number | null>(null)

const getShowcaseCharacters = async () => {
  if (showcaseUid.value.length !== 9) {
    snackbar.show(tx(i18n, "gameDataSync.invalidUidLength"), "error")
    return
  }

  loadingShowcaseUser.value = true

  try {
    const result = await $fetch<ShowcaseResponse>(`/api/v1/showcase?uid=${showcaseUid.value}`)
    showcaseResponse.value = result
    config.uid = showcaseUid.value
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "gameDataSync.fetchError"), "error")
  }

  loadingShowcaseUser.value = false
  fetchAvailableAfter.value = DateTime.now().plus({ seconds: 5 })
  pTimer.start()
}
const importGameData = async () => {
  if (!showcaseResponse.value) {
    return
  }

  loadingShowcaseUser.value = true

  try {
    await db.bookmarks.removeByShowcase(showcaseResponse.value.characters)
    for (const character of showcaseResponse.value.characters) {
      const characterId = parseShowcaseCharacterId(character.nameJP, character.variant)
      if (characterId === null) {
        continue
      }

      config.characterLevels[characterId] = {
        ascension: (() => {
          if (character.level >= 1 && character.level < 20) {
            return 1
          }
          if (character.level >= 20 && character.level < 30) {
            return 20
          }
          if (character.level >= 30 && character.level < 40) {
            return 30
          }
          if (character.level >= 40 && character.level < 50) {
            return 40
          }
          if (character.level >= 50 && character.level < 60) {
            return 50
          }
          if (character.level >= 60 && character.level < 70) {
            return 60
          }
          if (character.level >= 70 && character.level < 80) {
            return 70
          }
          return 80
        })(),
        ...Object.fromEntries(character.skills.map(e => [e.type, e.originalLevel])),
      }
    }
    emit("update:modelValue", false)
    snackbar.show(tx(i18n, "gameDataSync.importSuccess"))
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "gameDataSync.importError"), "error")
  }

  loadingShowcaseUser.value = false
}

const showcaseContent = computed<ShowcaseContent | null>(() => {
  if (!showcaseResponse.value) {
    return null
  }

  const content: ShowcaseContent = { ...showcaseResponse.value, characters: [] }
  for (const character of showcaseResponse.value.characters) {
    const characterId = parseShowcaseCharacterId(character.nameJP, character.variant)
    if (!characterId) continue
    const variant = getCharacterVariant(characterId)
    if (!variant) continue
    const equipmentData = character.equipment && (lightCones.find(e => e.name.locales.ja === character.equipment!.nameJP) ?? null)

    content.characters.push({
      id: characterId,
      name: localize(variant.name, i18n),
      imageUrl: getCharacterImage(characterId, "small"),
      level: character.level,
      promotion: character.promotion,
      rank: character.rank,
      skills: character.skills,
      equipment: equipmentData && {
        name: localize(equipmentData.name, i18n),
        imageUrl: getLightConeImage(equipmentData.id),
        level: character.equipment!.level,
        promotion: character.equipment!.promotion,
      },
    })
  }

  return content
})
</script>

<template>
  <GameDataSyncDialog
    v-model:uid="showcaseUid"
    :model-value="modelValue"
    :showcase="showcaseContent"
    :loading="loadingShowcaseUser"
    :fetch-available-in-seconds="fetchAvailableInSeconds"
    @get-data="getShowcaseCharacters"
    @import="importGameData"
    @update:model-value="$emit('update:modelValue', $event)"
    @clear="showcaseResponse = null"
  >
    <template #help>
      <GameDataSyncHelp />
    </template>
  </GameDataSyncDialog>
</template>
