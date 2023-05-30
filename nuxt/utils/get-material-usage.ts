import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"
import lightCones from "~/assets/data/light-cones.yaml"
import {LightCone} from "~/types/generated/light-cones.g"

/**
 * Gets a list of character IDs that use the material with the given `materialId`.
 *
 * @param materialId Material ID
 * @returns Character ID list
 */
export const getMaterialUsageCharacter = (materialId: string): string[] => {
  return characters.filter((character) => {
    const materialDefs = character.materials ? [character.materials] : character.variants!.map(variant => variant.materials)

    for (const materialDef of materialDefs) {
      for (const defExpr of Object.values(materialDef)) {
        const [defType, id] = defExpr.split(":")

        if (defType === "id" && id === materialId) {
          return true
        } else if (defType === "group") {
          const material = materials.find(e => e.id === materialId)!
          if (material.groupId === id) {
            return true
          }
        }
      }
    }

    return false
  }).map(e => e.id)
}

/**
 * Gets a list of light cone IDs that use the material with the given `materialId`.
 *
 * @param materialId Material ID
 * @returns Light cone ID list
 */
export const getMaterialUsageLightCone = (materialId: string): LightCone[] => {
  return lightCones.filter((lightCone) => {
    for (const defExpr of Object.values(lightCone.materials)) {
      const [defType, id] = defExpr.split(":")

      if (defType === "id" && id === materialId) {
        return true
      } else if (defType === "group") {
        const material = materials.find(e => e.id === materialId)!
        if (material.groupId === id) {
          return true
        }
      }
    }

    return false
  })
}
