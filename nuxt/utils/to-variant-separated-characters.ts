import {RouteLocationRaw} from "vue-router"
import {Character, Characters} from "~/types/generated/characters.g"

interface VariantCharacter extends Omit<Character, "variants"> {
  idWithVariant: string
  route: RouteLocationRaw
}

/**
 * Returns a list of {@link VariantCharacter} stored separately characters with multiple `variant` (mainly Trailblazer).
 *
 * @param characters The list of characters to convert.
 * @returns The list of characters with variants.
 */
export const toVariantSeparatedCharacters = (characters: Characters): VariantCharacter[] => {
  const result: VariantCharacter[] = []

  for (const character of characters) {
    if (character.variants) {
      for (const variant of character.variants) {
        const newObj = {...character}
        delete newObj.variants

        result.push({
          ...newObj,
          idWithVariant: `${newObj.id}_${variant.path}`,
          route: {path: `/characters/${newObj.id}`, query: {variant: variant.path}},
          materials: variant.materials,
        })
      }
    } else {
      result.push({
        ...character,
        idWithVariant: character.id,
        route: {path: `/characters/${character.id}`},
      })
    }
  }

  return result
}
