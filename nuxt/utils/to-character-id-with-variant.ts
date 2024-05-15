import type {CharacterIdWithVariant} from "~/types/strings"
import type {Path} from "~/types/generated/characters.g"

/**
 * Converts characterId and variant to a single string.
 */
export const toCharacterIdWithVariant = (characterId: string, variant: string | null): CharacterIdWithVariant => {
  return variant ? `${characterId}_${variant}` : characterId
}

/**
 * Extracts characterId from characterIdWithVariant.
 */
export const toCharacterId = (characterIdWithVariant: CharacterIdWithVariant): string => {
  return characterIdWithVariant.split("_")[0]
}

/**
 * Extracts variant from characterIdWithVariant. Returns null if no variant.
 */
export const toVariant = (characterIdWithVariant: CharacterIdWithVariant): Path | null => {
  const variant = characterIdWithVariant.split("_")[1]
  return variant ? variant as Path : null
}
