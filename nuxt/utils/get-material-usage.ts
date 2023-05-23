import characters from "~/assets/data/characters.yaml"
import materials from "~/assets/data/materials.csv"

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
