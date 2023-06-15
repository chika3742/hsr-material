import {Levels} from "~/types/generated/character-ingredients.g"
import {LevelIngredient} from "~/types/level-ingredient"

export const levelsToLevelIngredients = (levels: Levels): LevelIngredient[] => {
  return Object.entries(levels).map(([level, ingredients]) => ({
    level: parseInt(level),
    ingredients,
  }))
}
