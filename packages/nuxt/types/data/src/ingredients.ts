import type { EachLevels, EachPurposeTypes, Ingredient } from "../ingredient"

export interface Ingredients {
  ingredientsTables: Record<string, IngredientsTable>
}

export type IngredientsTable = EachPurposeTypes<EachLevels<Ingredient[]>>
