import characters from "~/assets/data/characters.yaml"
import { type HsrCharacterVariant, isCharacterGroup } from "~/types/data/src/characters"
import type { CharacterIdWithVariant } from "~/types/strings"

export const getCharacterVariant = (id: CharacterIdWithVariant): HsrCharacterVariant | null => {
  const character = characters.find(e => e.id === toCharacterId(id))
  if (!character) return null

  return isCharacterGroup(character)
    ? character.variants.find(e => e.path === toVariant(id)) ?? null
    : {
        name: character.name,
        combatType: character.combatType,
        path: character.path,
        levelingItemTable: character.levelingItemTable,
        materials: character.materials,
      }
}
