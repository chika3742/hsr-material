import type { EachLevels, Ingredient } from "~/types/data/ingredient"
import type { LevelIngredients } from "~/types/level-ingredients"

export const levelsToLevelIngredients = (levels: EachLevels<Ingredient[]>["levels"]): LevelIngredients[] => {
  return Object.entries(levels).map(([level, ingredients]) => ({
    level: parseInt(level),
    ingredients,
  }))
}
