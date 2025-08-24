import { describe, expect, it } from "vitest"
import { levelsToLevelIngredients } from "../../utils/levels-to-level-ingredients"
import type { EachLevels, Ingredient } from "../../types/data/ingredient"

describe("levelsToLevelIngredients", () => {
  it("should convert empty levels object", () => {
    const levels: EachLevels<Ingredient[]>["levels"] = {}
    const result = levelsToLevelIngredients(levels)
    expect(result).toEqual([])
  })

  it("should convert single level", () => {
    const mockIngredients: Ingredient[] = [
      { type: "character_exp", quantity: 1000 },
    ]
    const levels: EachLevels<Ingredient[]>["levels"] = {
      20: mockIngredients,
    }
    const result = levelsToLevelIngredients(levels)
    expect(result).toEqual([
      {
        level: 20,
        ingredients: mockIngredients,
      },
    ])
  })

  it("should convert multiple levels", () => {
    const ingredientsL20: Ingredient[] = [
      { type: "character_exp", quantity: 1000 },
    ]
    const ingredientsL40: Ingredient[] = [
      { type: "character_exp", quantity: 2000 },
      { type: "credit", quantity: 5000 },
    ]
    const ingredientsL60: Ingredient[] = [
      { type: "character_exp", quantity: 3000 },
    ]

    const levels: EachLevels<Ingredient[]>["levels"] = {
      20: ingredientsL20,
      40: ingredientsL40,
      60: ingredientsL60,
    }

    const result = levelsToLevelIngredients(levels)
    expect(result).toEqual([
      { level: 20, ingredients: ingredientsL20 },
      { level: 40, ingredients: ingredientsL40 },
      { level: 60, ingredients: ingredientsL60 },
    ])
  })

  it("should handle unsorted level keys", () => {
    const ingredientsL80: Ingredient[] = [{ type: "character_exp", quantity: 4000 }]
    const ingredientsL20: Ingredient[] = [{ type: "character_exp", quantity: 1000 }]
    const ingredientsL60: Ingredient[] = [{ type: "character_exp", quantity: 3000 }]

    const levels: EachLevels<Ingredient[]>["levels"] = {
      80: ingredientsL80,
      20: ingredientsL20,
      60: ingredientsL60,
    }

    const result = levelsToLevelIngredients(levels)
    // Check that all levels are correctly converted to numbers and ingredients are preserved
    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ level: 80, ingredients: ingredientsL80 })
    expect(result).toContainEqual({ level: 20, ingredients: ingredientsL20 })
    expect(result).toContainEqual({ level: 60, ingredients: ingredientsL60 })
  })

  it("should handle empty ingredients arrays", () => {
    const levels: EachLevels<Ingredient[]>["levels"] = {
      20: [],
      40: [],
    }

    const result = levelsToLevelIngredients(levels)
    expect(result).toEqual([
      { level: 20, ingredients: [] },
      { level: 40, ingredients: [] },
    ])
  })

  it("should convert level strings to numbers correctly", () => {
    const ingredients: Ingredient[] = [{ type: "character_exp", quantity: 1000 }]
    const levels: EachLevels<Ingredient[]>["levels"] = {
      0: ingredients, // Edge case: level 0
      1: ingredients, // Single digit
      80: ingredients, // Two digits
    }

    const result = levelsToLevelIngredients(levels)
    expect(result).toEqual([
      { level: 0, ingredients },
      { level: 1, ingredients },
      { level: 80, ingredients },
    ])
  })
})
