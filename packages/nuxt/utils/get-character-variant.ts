import { omit } from "lodash-es"
import characters from "~/assets/data/characters.yaml"
import { type HsrCharacterVariant, isCharacterGroup } from "~/types/data/src/characters"
import type { CharacterIdWithVariant } from "~/types/strings"

export const getCharacterVariant = (id: CharacterIdWithVariant, fallbackGroup: boolean = false): HsrCharacterVariant | null => {
  const character = characters.find(e => e.id === toCharacterId(id))
  if (character === undefined) return null

  return isCharacterGroup(character)
    ? character.variants.find(e => e.path === toVariant(id)) ?? (fallbackGroup ? character.variants[0] : null)
    : omit(character, ["id", "rarity", "yomi"])
}
