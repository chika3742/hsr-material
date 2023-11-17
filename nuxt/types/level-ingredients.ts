import type {Ingredient} from "~/types/generated/character-ingredients.g"

export interface LevelIngredients {
  level: number
  ingredients: Ingredient[]
}
