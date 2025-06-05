import { omit } from "lodash-es"
import hCharacters from "~/assets/data/characters.yaml"
import { type CharacterIdWithVariant, type HsrCharacterSpecs, isCharacterGroup } from "~/types/data/src/characters"

export const getCharacterVariant = (id: CharacterIdWithVariant, fallbackGroup: boolean = false): HsrCharacterSpecs | null => {
  const character = hCharacters.find(e => e.id === toCharacterId(id))
  if (character === undefined) return null

  return isCharacterGroup(character)
    ? character.variants.find(e => e.variantId === toVariant(id)) ?? (fallbackGroup ? character.variants[0] : null)
    : omit(character, ["id", "rarity", "yomi"])
}
