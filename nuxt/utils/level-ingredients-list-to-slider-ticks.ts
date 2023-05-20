import {LevelIngredients} from "~/types/generated/character-ingredients.g"

export const levelIngredientsListToSliderTicks = (levelIngredientsList: LevelIngredients[]): number[] => {
  return [1, ...levelIngredientsList.map(e => e.level)]
}
