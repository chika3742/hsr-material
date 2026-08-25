import type { EachLevels, EachPurposeTypes, Ingredient } from "../ingredient"

export interface Ingredients {
  expItems: {
    itemId: string
    expPerItem: number
  }[]
  ingredientsTables: Record<string, IngredientsTable>
}

type IngredientsTable = EachPurposeTypes<EachLevels<Ingredient[]>>
