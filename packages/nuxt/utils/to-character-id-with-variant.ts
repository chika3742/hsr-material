import type { HsrPath } from "~/types/data/enums"
import type { CharacterIdWithVariant } from "~/types/strings"

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
export const toVariant = (characterIdWithVariant: CharacterIdWithVariant): HsrPath | null => {
  const variant = characterIdWithVariant.split("_").slice(1).join("_")
  return variant ? variant as HsrPath : null
}
