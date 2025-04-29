import characters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"

export default defineNuxtPlugin(() => {
  const characterSelectItems: { id: string, image: string }[] = []

  for (const character of characters) {
    if (isCharacterGroup(character)) {
      for (const variant of character.variants) {
        characterSelectItems.push({
          id: toCharacterIdWithVariant(character.id, variant.path),
          image: getCharacterImage(toCharacterIdWithVariant(character.id, variant.path), "small"),
        })
      }
    } else {
      characterSelectItems.push({
        id: character.id,
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
