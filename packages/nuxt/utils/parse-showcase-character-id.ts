import hCharacters from "~/assets/data/characters.yaml"
import { isCharacterGroup } from "~/types/data/src/characters"

export const parseShowcaseCharacterId = (nameJP: string, combatType: string): string | null => {
  const character = hCharacters.find(e => e.name.locales.ja === nameJP)
  if (!character) {
    return null // Character not found
  }
  if (isCharacterGroup(character)) {
    const variantId = character.variants.find(e => e.combatType === combatType)?.variantId
    if (!variantId) {
      return null
    }
    return toCharacterIdWithVariant(character.id, variantId)
  }
  return hCharacters.find(e => e.name.locales.ja === nameJP)?.id ?? null
}
