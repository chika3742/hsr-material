import type {LevelIngredients} from "~/types/level-ingredients"

/**
 * Converts {@link LevelIngredients} array to slider ticks.
 *
 * The first tick is always 1.
 * The other ticks are the `level` values from {@link LevelIngredients}.
 *
 * @param levelIngredients {@link LevelIngredient} array
 */
export const levelIngredientsToSliderTicks = (levelIngredients: LevelIngredients[]): number[] => {
  return [1, ...levelIngredients.map(e => e.level)]
}
