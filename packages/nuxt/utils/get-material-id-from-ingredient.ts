import materials from "~/assets/data/materials.csv"
import { isCraftableIngredient, isExpIngredient, isFixedIdIngredient, type Ingredient } from "~/types/data/ingredient"

type MaterialDefinitions = Partial<Record<string, string>>

/**
 * Gets material corresponds to {@link Ingredient} and {@link MaterialDefinitions}.
 *
 * {@link Ingredient} includes material type and craft level, and {@link MaterialDefinitions} includes material ID.
 *
 * @param ingredient {@link Ingredient}
 * @param materialDefs {@link CharacterMaterialDefinitions} or {@link LightConeMaterialDefinitions}
 * @returns material ID
 */
export function getMaterialIdFromIngredient(ingredient: Ingredient, materialDefs: MaterialDefinitions): string {
  if (isExpIngredient(ingredient)) {
    throw new Error("ExpIngredient is unsupported in this function")
  }

  if (isFixedIdIngredient(ingredient)) {
    return ingredient.fixedId
  }

  const defString = materialDefs[ingredient.type!]
  if (!defString) {
    throw new Error(`Material definition not found for ${ingredient.type}`)
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
