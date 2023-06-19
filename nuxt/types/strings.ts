import {CharacterIngredients} from "~/types/generated/character-ingredients.g"
import {Path} from "~/types/generated/characters.g"

export type ThemeSetting = "dark" | "light" | "auto"

export type PurposeType = keyof CharacterIngredients["purposeTypes"]

export type CharacterIdWithVariant = string | `${string}_${Path}`
