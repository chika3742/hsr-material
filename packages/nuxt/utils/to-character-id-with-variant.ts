import type { CharacterId, CharacterIdWithVariant, CharacterVariantId } from "~/types/data/src/characters"

/**
 * Converts characterId and variant to a single string.
 */
export const toCharacterIdWithVariant = (characterId: string, variant: string | null): CharacterIdWithVariant => {
  return variant ? `${characterId}_${variant}` : characterId
}

/**
 * Extracts characterId from characterIdWithVariant.
 */
export const toCharacterId = (characterIdWithVariant: CharacterIdWithVariant): CharacterId => {
  return (characterIdWithVariant.split("_")[0] ?? "") as CharacterId
}

/**
 * Extracts variant from characterIdWithVariant. Returns null if no variant.
 */
export const toVariant = (characterIdWithVariant: CharacterIdWithVariant): CharacterVariantId | null => {
  const variant = characterIdWithVariant.split("_").slice(1).join("_")
  return variant ? variant : null
}
