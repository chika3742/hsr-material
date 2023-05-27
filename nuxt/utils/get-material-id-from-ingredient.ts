import materials from "~/assets/data/materials.csv"
import {Ingredient} from "~/types/generated/character-ingredients.g"
import {CharacterMaterialDefinitions} from "~/types/generated/characters.g"
import {LightConeMaterialDefinitions} from "~/types/generated/light-cones.g"

type MaterialDefinitions = Partial<Record<keyof CharacterMaterialDefinitions | keyof LightConeMaterialDefinitions, string>>

export function getMaterialIdFromIngredient(ingredient: Ingredient, materialDefs: MaterialDefinitions): string {
  if (ingredient.fixedId) {
    return ingredient.fixedId
  }

  const defString = materialDefs[ingredient.type!]
  if (!defString) {
    throw new Error(`Material definition not found for ${ingredient.type}`)
  }

  const [defType, id] = defString.split(":")
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
