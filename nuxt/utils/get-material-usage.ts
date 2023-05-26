import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"
import lightCones from "~/assets/data/light-cones.yaml"
import {LightCone} from "~/types/generated/light-cones.g"

/**
 * 与えられた`materialId`を持つ素材を利用するキャラクターのIDのリストを取得する。
 *
 * @param materialId 素材のID
 * @returns キャラクターIDのリスト
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
 * 与えられた`materialId`を持つ素材を利用する光円錐のIDのリストを取得する。
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
