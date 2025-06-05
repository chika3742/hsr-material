<script setup lang="ts">
import { omit } from "lodash-es"
import gCharacters from "~/assets/data/genshin/characters.yaml"
import { isCharacterGroup, type CharacterVariantId, type GenshinCharacterSpecs } from "~/types/data/src/characters"

const route = useRoute()
const i18n = useI18n()

const character = gCharacters.find(e => e.id === route.params.characterId)
if (character === undefined) {
  throw createError({ statusCode: 404, message: "Page not found", fatal: true })
}

const currentVariantId = ref<CharacterVariantId | null>(isCharacterGroup(character) ? character.variants[0]!.variantId : null)

const currentVariant = computed<GenshinCharacterSpecs>(() => {
  if (!isCharacterGroup(character)) {
    return omit(character, ["id", "rarity", "yomi"])
  } else {
    return omit(character.variants.find(e => e.variantId === currentVariantId.value)!, ["variantId"])
  }
})

usePageTitle(computed(() => tx(
  i18n,
  "pageTitles.characterDetails",
  { name: localize(currentVariant.value.name) },
)))
</script>

<template>
  <div />
</template>
