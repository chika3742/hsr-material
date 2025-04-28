import type { EachPurposeTypes, EachLevels, Ingredient } from "../ingredient"

export interface Ingredients {
  expItems: {
    itemId: string
    expPerItem: number
  }[]
  levelingItemTables: Record<string, IngredientTable>
}

type IngredientTable = EachPurposeTypes<EachLevels<Ingredient[]>>
