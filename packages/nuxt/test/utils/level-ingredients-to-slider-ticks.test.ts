import { describe, expect, it } from "vitest"
import { levelIngredientsToSliderTicks } from "../../utils/level-ingredients-to-slider-ticks"
import type { LevelIngredients } from "../../types/level-ingredients"

describe("levelIngredientsToSliderTicks", () => {
  it("should return [1] for empty array", () => {
    const result = levelIngredientsToSliderTicks([])
    expect(result).toEqual([1])
  })

  it("should return [1, level] for single level ingredient", () => {
    const levelIngredients: LevelIngredients[] = [
      { level: 20, ingredients: [] }
    ]
    const result = levelIngredientsToSliderTicks(levelIngredients)
    expect(result).toEqual([1, 20])
  })

  it("should return [1, ...levels] for multiple level ingredients", () => {
    const levelIngredients: LevelIngredients[] = [
      { level: 20, ingredients: [] },
      { level: 40, ingredients: [] },
      { level: 50, ingredients: [] },
      { level: 60, ingredients: [] },
      { level: 70, ingredients: [] },
      { level: 80, ingredients: [] }
    ]
    const result = levelIngredientsToSliderTicks(levelIngredients)
    expect(result).toEqual([1, 20, 40, 50, 60, 70, 80])
  })

  it("should handle unsorted level ingredients", () => {
    const levelIngredients: LevelIngredients[] = [
      { level: 80, ingredients: [] },
      { level: 20, ingredients: [] },
      { level: 60, ingredients: [] },
      { level: 40, ingredients: [] }
    ]
    const result = levelIngredientsToSliderTicks(levelIngredients)
    expect(result).toEqual([1, 80, 20, 60, 40])
  })

  it("should handle duplicate levels", () => {
    const levelIngredients: LevelIngredients[] = [
      { level: 20, ingredients: [] },
      { level: 20, ingredients: [] },
      { level: 40, ingredients: [] }
    ]
    const result = levelIngredientsToSliderTicks(levelIngredients)
    expect(result).toEqual([1, 20, 20, 40])
  })
})