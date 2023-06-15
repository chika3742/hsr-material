import {LevelIngredient} from "~/types/level-ingredient"

/**
 * Converts {@link LevelIngredient} array to slider ticks.
 *
 * The first tick is always 1.
 * The other ticks are the `level` values from {@link LevelIngredient}.
 *
 * @param levelIngredients {@link LevelIngredient} array
 */
export const levelIngredientsToSliderTicks = (levelIngredients: LevelIngredient[]): number[] => {
  return [1, ...levelIngredients.map(e => e.level)]
}
