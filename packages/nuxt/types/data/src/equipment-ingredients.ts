import type { EachLevels, Ingredient } from "../ingredients"

export interface EquipmentIngredients {
  expItems: {
    itemId: string
    expPerItem: number
  }[]
  levelingItemTables: Record<string, IngredientTable>
}

type IngredientTable = EachLevels<Ingredient[]>
