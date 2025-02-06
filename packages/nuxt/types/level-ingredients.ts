import type { CharacterIngredients, Ingredient } from "~/types/generated/character-ingredients.g"

export interface LevelIngredients {
  level: number
  ingredients: Ingredient[]
}

export type LevelsForPurposeTypes = CharacterIngredients["levelingItemTables"][string]["purposeTypes"]
