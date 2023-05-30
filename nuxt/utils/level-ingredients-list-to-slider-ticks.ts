import {LevelIngredients} from "~/types/generated/character-ingredients.g"

/**
 * Converts {@link LevelIngredients} list to slider ticks.
 *
 * The first tick is always 1.
 * The other ticks are the levels of {@link LevelIngredients}.
 *
 * @param levelIngredientsList {@link LevelIngredients} list
 */
export const levelIngredientsListToSliderTicks = (levelIngredientsList: LevelIngredients[]): number[] => {
  return [1, ...levelIngredientsList.map(e => e.level)]
}
