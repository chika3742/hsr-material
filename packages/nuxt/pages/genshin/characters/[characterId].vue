<script setup lang="ts">
import { omit } from "lodash-es"
import { useTheme } from "vuetify"
import gCharacters from "~/assets/data/genshin/characters.yaml"
import type { CharacterAttribute } from "~/components/character/CharacterInfoBox.vue"
import { isCharacterGroup, type CharacterVariantId, type GenshinCharacterSpecs } from "~/types/data/src/characters"

const route = useRoute()
const i18n = useI18n()
const theme = useTheme()

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

const attrs = computed<CharacterAttribute[]>(() => [
  {
    title: tx(i18n, "common.element"),
    contentImageUrl: getElementImage(currentVariant.value.element),
    invertContentImage: !theme.current.value.dark,
    content: tx(i18n, `elements.${currentVariant.value.element}`),
  },
  {
    title: tx(i18n, "common.weaponType"),
    content: tx(i18n, `weaponTypes.${currentVariant.value.weaponType}`),
  },
])
</script>

<template>
  <div>
    <CharacterInfoBox
      :image-url="getGenshinCharacterImage(toCharacterIdWithVariant(character.id, currentVariantId), 'small')"
      :attributes="attrs"
    >
      <template #rarity>
        <RarityStars :count="character.rarity" />
      </template>
    </CharacterInfoBox>
  </div>
</template>
