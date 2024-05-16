import type {CharacterIngredients} from "~/types/generated/character-ingredients.g"
import type {Path} from "~/types/generated/characters.g"

export type PurposeType = keyof CharacterIngredients["purposeTypes"]

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type CharacterIdWithVariant = string | `${string}_${Path}`
