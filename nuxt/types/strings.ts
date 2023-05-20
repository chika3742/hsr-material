import {CharacterIngredients} from "~/types/generated/character-ingredients.g"

export type ThemeSetting = "dark" | "light" | "auto"

export type TargetType = "character" // | "light_cone"

export type PurposeType = keyof CharacterIngredients
