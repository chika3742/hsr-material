import characters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"
import type { Composer } from "#i18n"

export default defineNuxtPlugin((nuxtApp) => {
  const characterSelectItems: { id: string, name: string, image: string }[] = []

  for (const character of characters) {
    if (isCharacterGroup(character)) {
      for (const variant of character.variants) {
        characterSelectItems.push({
          id: toCharacterIdWithVariant(character.id, variant.variantId),
          name: localize(variant.name, nuxtApp.$i18n as Composer),
          image: getCharacterImage(toCharacterIdWithVariant(character.id, variant.variantId), "small"),
        })
      }
    } else {
      characterSelectItems.push({
        id: character.id,
        name: localize(character.name, nuxtApp.$i18n as Composer),
        image: getCharacterImage(character.id, "small"),
      })
    }
  }

  return {
    provide: {
      characterSelectItems,
    },
  }
})
