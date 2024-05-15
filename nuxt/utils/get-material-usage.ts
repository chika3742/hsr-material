import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"
import lightCones from "~/assets/data/light-cones.yaml"
import type {LightCone} from "~/types/generated/light-cones.g"
import type {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"

interface UsageCharacter {
  id: string
  variant?: Path
}

/**
 * Whether the material is included in the definitions.
 *
 * When the value of each type
 *
 * - starts with `group:`, tests if the value matches `groupId` of the material.
 * - starts with `id:`, tests if the value matches `id` of the material。
 *
 * Returns `true` if any of the properties match.
 *
 * @param materialId Material ID
 * @param defs {@link CharacterMaterialDefinitions}
 * @returns `true` if the material is used.
 */
const getIsMaterialUsedByCharacter = (materialId: string, defs: CharacterMaterialDefinitions): boolean => {
  for (const defExpr of Object.values(defs) as string[]) {
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
}

/**
 * Gets characters use the material.
 *
 * @param materialId Material ID
 * @returns {@link UsageCharacter} list
 */
export const getMaterialUsageCharacter = (materialId: string): UsageCharacter[] => {
  const result: UsageCharacter[] = []

  for (const character of characters) {
    if (character.variants) {
      for (const variant of character.variants) {
        if (getIsMaterialUsedByCharacter(materialId, variant.materials)) {
          result.push({id: character.id, variant: variant.path})
        }
      }
    } else if (getIsMaterialUsedByCharacter(materialId, character.materials!)) {
      result.push({id: character.id})
    }
  }

  return result
}

/**
 * Gets light cones use the material.
 *
 * @param materialId Material ID
 * @returns Light cone ID list
 */
export const getMaterialUsageLightCone = (materialId: string): LightCone[] => {
  return lightCones.filter((lightCone) => {
    for (const defExpr of Object.values(lightCone.materials) as string[]) {
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
