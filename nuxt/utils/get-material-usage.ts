import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"
import lightCones from "~/assets/data/light-cones.yaml"
import {LightCone} from "~/types/generated/light-cones.g"
import {CharacterMaterialDefinitions, Path} from "~/types/generated/characters.g"

interface UsageCharacter {
  id: string
  variant?: Path
}

/**
 * 素材が{@link CharacterMaterialDefinitions}に含まれるかどうか。
 * 各プロパティの値が
 *
 * - `group:`で始まる場合は、{@link Material}の`groupId`と定義が一致するかどうかをテストする。
 * - `id:`で始まる場合は、{@link Material}の`id`と定義が一致するかどうかをテストする。
 *
 * プロパティのいずれかが一致した場合は`true`を返す。
 *
 * @param materialId 素材ID
 * @param defs {@link CharacterMaterialDefinitions}
 * @returns テストの結果
 */
const getIsMaterialUsedByCharacter = (materialId: string, defs: CharacterMaterialDefinitions): boolean => {
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
 * 与えられた素材を利用するキャラクターのリストを取得する。
 *
 * @param materialId 素材のID
 * @returns {@link UsageCharacter}のリスト
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
 * 与えられた素材を利用する光円錐のIDのリストを取得する。
 *
 * @param materialId 素材のID
 * @returns 光円錐IDのリスト
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
