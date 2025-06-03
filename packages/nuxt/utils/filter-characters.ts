import { isCharacterGroup, type Character, type CharacterSpecs } from "~/types/data/src/characters"

/**
 * Options for searching characters with customizable matching criteria.
 *
 * @property matchInVariant - An optional record specifying criteria to match within character variants.
 * @property matchInRoot - An optional record specifying criteria to match within root characters.
 */
type SearchOptions = {
  matchInVariant?: Record<string, unknown>
  matchInRoot?: Record<string, unknown>
}

export const filterCharacters = <T extends Character>(characters: T[], options: SearchOptions): T[] => {
  const { matchInVariant, matchInRoot } = options

  return characters.filter((character) => {
    const variantMatch = matchInVariant
      ? Object.entries(matchInVariant).every(([_key, value]) => {
          const key = _key as keyof CharacterSpecs
          return isCharacterGroup(character) ? character.variants.some(variant => variant[key] === value) : character[key] === value
        })
      : true

    const rootMatch = matchInRoot
      ? Object.entries(matchInRoot).every(([key, value]) => character[key as keyof Character] === value)
      : true

    return variantMatch && rootMatch
  })
}
