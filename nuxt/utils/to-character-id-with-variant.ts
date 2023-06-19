import {CharacterIdWithVariant} from "~/types/strings"

export const toCharacterIdWithVariant = (characterId: string, variant: string | null): CharacterIdWithVariant => {
  return variant ? `${characterId}_${variant}` : characterId
}
