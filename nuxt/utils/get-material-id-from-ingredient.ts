import {Ingredient} from "~/types/generated/character-ingredients.g"
import {CharacterMaterialDefinitions} from "~/types/generated/characters.g"
import materials from "~/assets/data/materials.csv"

export function getMaterialIdFromIngredient(ingredient: Ingredient, materialDefs: CharacterMaterialDefinitions /* | Weapon */): string {
  if (ingredient.fixedId) {
    return ingredient.fixedId
  }

  const [defType, id] = materialDefs[ingredient.type!].split(":")
  if (defType === "id") {
    return id
  } else if (defType === "group") {
    const material = materials.find(e => e.groupId === id && e.craftLevel === ingredient.craftLevel)
    if (!material) {
      throw new Error(`Material not found for group ${id} and craft level ${ingredient.craftLevel}`)
    }

    return material.id
  } else {
    throw new Error("Parsing def error")
  }
}
