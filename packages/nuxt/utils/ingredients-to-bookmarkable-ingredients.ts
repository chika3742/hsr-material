import type { BookmarkableIngredient } from "~/types/bookmark/bookmarkables"
import type { LevelIngredients } from "~/types/level-ingredients"
import type { CharacterIdWithVariant } from "~/types/data/src/characters"
import { isExpIngredient } from "~/types/data/ingredient"
import { getMaterialIdFromIngredient } from "~/utils/get-material-id-from-ingredient"
import type { PurposeType } from "~/types/data/enums"

interface IngredientsToBookmarkableIngredientsOptions {
  levelIngredients: LevelIngredients[]
  characterId: CharacterIdWithVariant
  lightConeId?: string
  materialDefs?: Record<string, string>
  purposeType: PurposeType
}

export function ingredientsToBookmarkableIngredients({
  levelIngredients,
  characterId,
  lightConeId,
  materialDefs,
  purposeType,
}: IngredientsToBookmarkableIngredientsOptions): BookmarkableIngredient[] {
  const result: BookmarkableIngredient[] = []

  for (const level of levelIngredients) {
    for (const ingredient of level.ingredients) {
      if (isExpIngredient(ingredient)) {
        if (purposeType !== "ascension") {
          throw new Error("Invalid purpose type for exp ingredient")
        }

        result.push({
          type: lightConeId ? "light_cone_exp" : "character_exp",
          characterId,
          usage: {
            type: "exp",
            lightConeId: lightConeId ?? null,
            purposeType,
            upperLevel: level.level,
          },
          exp: ingredient.exp,
        })
      } else {
        const materialId = getMaterialIdFromIngredient(ingredient, materialDefs ?? {}, characterId)
        if (!materialId) {
          continue
        }

        if (lightConeId) {
          if (purposeType !== "ascension") {
            throw new Error("Invalid purpose type for light cone ingredient")
          }

          result.push({
            type: "light_cone_material",
            characterId,
            usage: {
              type: "light_cone",
              lightConeId,
              purposeType,
              upperLevel: level.level,
            },
            materialId,
            quantity: ingredient.quantity,
          })
        } else {
          result.push({
            type: "character_material",
            characterId,
            usage: {
              type: "character",
              purposeType,
              upperLevel: level.level,
            },
            materialId,
            quantity: ingredient.quantity,
          })
        }
      }
    }
  }

  return result
}
