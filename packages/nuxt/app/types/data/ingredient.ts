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
export function isFixedIdIngredient(x: Ingredient): x is FixedIdIngredient {
  return "fixedId" in x && typeof x.fixedId === "string"
}

export interface ExpIngredient {
  exp: number
}
export function isExpIngredient(x: Ingredient): x is ExpIngredient {
  return "exp" in x && typeof x.exp === "number"
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
export function isCraftableIngredient(x: Ingredient): x is CraftableIngredient {
  return "craftLevel" in x && typeof x.craftLevel === "number"
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
