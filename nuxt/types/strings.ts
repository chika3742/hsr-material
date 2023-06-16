import {CharacterIngredients} from "~/types/generated/character-ingredients.g"

export type ThemeSetting = "dark" | "light" | "auto"

export type PurposeType = keyof CharacterIngredients["purposeTypes"]
