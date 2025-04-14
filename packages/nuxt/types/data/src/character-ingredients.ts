import type { EachLevels, EachPurposeTypes, Ingredient } from "../ingredients"

export interface CharacterIngredients {
  expItems: {
    itemId: string
    expPerItem: number
  }[]
  levelingItemTables: Record<string, IngredientTable>
}

type IngredientTable = EachPurposeTypes<EachLevels<Ingredient[]>>
