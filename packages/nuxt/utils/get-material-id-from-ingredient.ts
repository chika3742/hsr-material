import materials from "~/assets/data/materials.yaml"
import { type Ingredient, isCraftableIngredient, isExpIngredient, isFixedIdIngredient } from "~/types/data/ingredient"

type MaterialDefinitions = Partial<Record<string, string>>

/**
 * Gets material corresponds to {@link Ingredient} and {@link MaterialDefinitions}.
 *
 * {@link Ingredient} includes material type and craft level, and {@link MaterialDefinitions} includes material ID.
 *
 * @param ingredient {@link Ingredient}
 * @param materialDefs {@link CharacterMaterialDefinitions} or {@link LightConeMaterialDefinitions}
 * @returns Material ID or `null`. If null, the quantity of this ingredient is zero.
 */
export function getMaterialIdFromIngredient(ingredient: Ingredient, materialDefs: MaterialDefinitions, characterId: string): string | null {
  if (isExpIngredient(ingredient)) {
    throw new Error("ExpIngredient is unsupported in this function")
  }

  if (isFixedIdIngredient(ingredient)) {
    return ingredient.fixedId
  }

  if (ingredient.overrides?.[characterId]) {
    return ingredient.overrides?.[characterId]
  }

  const defString = materialDefs[ingredient.type!]
  if (!defString) {
    return null
  }

  const [defType, id] = defString.split(":")
  if (defType === "id") {
    return id
  } else if (defType === "group" && isCraftableIngredient(ingredient)) {
    const material = materials.find(e => e.groupId === id && e.craftLevel === ingredient.craftLevel)
    if (!material) {
      throw new Error(`Material not found for group ${id} and craft level ${ingredient.craftLevel}`)
    }

    return material.id
  } else {
    throw new Error("Parsing def error")
  }
}
