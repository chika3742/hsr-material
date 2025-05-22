import characters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"

export const parseShowcaseCharacterId = (nameJP: string, combatType: string) => {
  const character = characters.find(e => e.name.locales.ja === nameJP)
  if (!character) {
    return null
  }
  if (isCharacterGroup(character)) {
    const path = character.variants.find(e => e.combatType === combatType)?.path
    if (!path) {
      return null
    }
    return toCharacterIdWithVariant(character.id, path)
  }
  return characters.find(e => e.name.locales.ja === nameJP)?.id
}
