<script setup lang="ts">
import characters from "~/assets/data/characters.yaml"
import lightCones from "~/assets/data/light-cones.yaml"
import { db } from "~/libs/db/providers"

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

watch(toRefs(props).modelValue, (value) => {
  if (value) {
    showcaseUid.value = config.uid
  }
})

const showcaseUid = ref("")
const showcaseUser = ref<UserInfoResponse>()
const loadingShowcaseUser = ref(false)
const getters: DataSyncMapGetters = {
  getCharacterId: (character: ShowcaseCharacter) => {
    if (character.nameJP === "開拓者") {
      const variant = characters.find(e => e.id === "trailblazer")!.variants!
        .find(e => e.combatType === character.variant)
      if (!variant) {
        return ""
      }

      return toCharacterIdWithVariant("trailblazer", variant.path)
    } else {
      return characters.find(e => e.$nameJA === character.nameJP)?.id ?? ""
    }
  },
  getCharacterImage: (character: ShowcaseCharacter) =>
    getCharacterImage(characters.find(e => e.$nameJA === character.nameJP)?.id ?? "", "small"),
  getEquipmentId: (lightConeName: string) =>
    lightCones.find(e => e.$nameJA === lightConeName)?.id ?? "",
  getEquipmentImage: (lightConeId: string) => getLightConeImage(lightConeId),
}
const getShowcaseCharacters = async () => {
  if (showcaseUid.value.length !== 9) {
    snackbar.show(tx(i18n, "gameDataSync.invalidUidLength"), "error")
    return
  }

  loadingShowcaseUser.value = true

  try {
    const result = await $fetch<UserInfoResponse>(`/api/v1/showcase?uid=${showcaseUid.value}`)
    showcaseUser.value = result
    config.uid = showcaseUid.value
  } catch (e) {
    console.error(e)
    snackbar.show(tx(i18n, "gameDataSync.fetchError"), "error")
  }

  loadingShowcaseUser.value = false
}
const importGameData = async () => {
  if (typeof showcaseUser.value === "undefined") {
    return
  }

  loadingShowcaseUser.value = true

  try {
    await db.bookmarks.removeByShowcase(showcaseUser.value.characters)
    for (const character of showcaseUser.value.characters) {
      const characterId = parseShowcaseCharacterId(character.nameJP, character.variant)
      if (typeof characterId === "undefined") {
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
</script>

<template>
  <GameDataSyncDialog
    v-model:user="showcaseUser"
    v-model:uid="showcaseUid"
    :model-value="modelValue"
    :getters="getters"
    :loading="loadingShowcaseUser"
    @get-data="getShowcaseCharacters"
    @import="importGameData"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #help>
      <GameDataSyncHelp />
    </template>
  </GameDataSyncDialog>
</template>
