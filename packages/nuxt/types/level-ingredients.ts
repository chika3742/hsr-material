import type { Ingredient } from "./data/ingredient"
import type { Ingredients } from "./data/src/ingredients"

export interface LevelIngredients {
  level: number
  ingredients: Ingredient[]
}

export type LevelsForPurposeTypes = Ingredients["levelingItemTables"][string]["purposeTypes"]
