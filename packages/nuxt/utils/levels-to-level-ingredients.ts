import type {Levels} from "~/types/generated/character-ingredients.g"
import type {LevelIngredients} from "~/types/level-ingredients"

export const levelsToLevelIngredients = (levels: Levels): LevelIngredients[] => {
  return Object.entries(levels).map(([level, ingredients]) => ({
    level: parseInt(level),
    ingredients,
  }))
}
