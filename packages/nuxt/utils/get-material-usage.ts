import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"
import lightCones from "~/assets/data/light-cones.yaml"
import type { MaterialExpr } from "~/types/data/ingredient"
import { isCharacterGroup } from "~/types/data/src/characters"
import type { LightCone } from "~/types/data/src/equipments"
import type { HsrPath } from "~/types/data/enums"

interface UsageCharacter {
  id: string
  variant?: HsrPath
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
 * @param defs Record of purpose type id and {@link MaterialExpr}
 * @returns `true` if the material is used.
 */
const getIsMaterialUsedByCharacter = (materialId: string, defs: Record<string, MaterialExpr>): boolean => {
  for (const defExpr of Object.values(defs)) {
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
    if (isCharacterGroup(character)) {
      for (const variant of character.variants) {
        if (getIsMaterialUsedByCharacter(materialId, variant.materials)) {
          result.push({ id: character.id, variant: variant.path })
        }
      }
    } else if (getIsMaterialUsedByCharacter(materialId, character.materials!)) {
      result.push({ id: character.id })
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
  const pathOrderMap: Record<HsrPath, number> = {
    destruction: 1,
    the_hunt: 2,
    erudition: 3,
    harmony: 4,
    nihility: 5,
    preservation: 6,
    abundance: 7,
    remembrance: 8,
  }

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
    .sort((a, b) => b.rarity - a.rarity)
    .sort((a, b) => pathOrderMap[a.path] - pathOrderMap[b.path])
}
