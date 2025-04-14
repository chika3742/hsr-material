import type { HsrPurposeType } from "./enums"

export type Ingredient = FixedIdIngredient | ExpIngredient | TypedIngredient | CraftableIngredient

interface IngredientOverrides {
  overrides?: {
    [id: string]: string
  }
}

export interface FixedIdIngredient {
  fixedId: string
  quantity: number
}

export interface ExpIngredient {
  exp: number
}

export interface TypedIngredient extends IngredientOverrides {
  type: "ascension" | "skillsAdvanced"
  quantity: number
}

export interface CraftableIngredient extends IngredientOverrides {
  type: "common" | "primary" | "ascension" | "skills"
  quantity: number
  craftLevel: number
}

export type EachPurposeTypes<T> = {
  purposeTypes: Partial<Record<HsrPurposeType, T>>
}

export type EachLevels<T> = {
  levels: {
    [level: string]: T
  }
}

export type MaterialExpr = `${"group" | "id"}:${string}`
