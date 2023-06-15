import {Ingredient} from "~/types/generated/character-ingredients.g"

export interface LevelIngredient {
  level: number
  ingredients: Ingredient[]
}
