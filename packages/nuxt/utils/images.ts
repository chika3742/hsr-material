import type { Game, GenshinElement, HsrCombatType, HsrPath } from "~/types/data/enums"

/**
 * Gets Genshin character image URL.
 *
 * @param characterId Character ID
 * @param variant When `full`, returns 800x400 splash image. When `small`, returns icon image.
 * @returns Image URL
 */
export const getGenshinCharacterImage = (characterId: string, variant: "full" | "small"): string => {
  if (variant === "full") {
    return new URL(`../assets/img/genshin/characters/${characterId}.webp`, import.meta.url).toString()
  } else {
    return new URL(`../assets/img/genshin/characters/${characterId}_small.webp`, import.meta.url).toString()
  }
}

/**
 * Gets HSR character image URL.
 *
 * @param characterId Character ID
 * @param variant When `full`, returns 800x400 splash image. When `small`, returns icon image.
 * @returns Image URL
 */
export const getHsrCharacterImage = (characterId: string, variant: "full" | "small"): string => {
  if (variant === "full") {
    return new URL(`../assets/img/hsr/characters/${characterId}.webp`, import.meta.url).toString()
  } else {
    return new URL(`../assets/img/hsr/characters/${characterId}_small.webp`, import.meta.url).toString()
  }
}

/**
 * Gets light cone image URL.
 *
 * @param lightConeId Light cone ID
 * @returns Image URL
 */
export const getLightConeImage = (lightConeId: string) => {
  return new URL(`../assets/img/hsr/light-cones/${lightConeId}.webp`, import.meta.url).toString()
}

/**
 * Gets combat type image URL.
 *
 * @param type Combat type
 * @returns Image URL
 */
export const getCombatTypeImage = (type: HsrCombatType) => {
  return new URL(`../assets/img/hsr/combat-types/${type}.webp`, import.meta.url).toString()
}

/**
 * Gets path image URL.
 *
 * @param path Path
 * @returns Image URL
 */
export const getPathImage = (path: HsrPath) => {
  return new URL(`../assets/img/hsr/paths/${path}.webp`, import.meta.url).toString()
}

/**
 * Gets Genshin material image URL.
 *
 * @param materialId Material ID
 * @returns Image URL
 */
export const getGenshinMaterialImage = (game: Game, materialId: string) => {
  return new URL(`../assets/img/genshin/materials/${materialId}.webp`, import.meta.url).toString()
}

/**
 * Gets material image URL.
 *
 * @param materialId Material ID
 * @returns Image URL
 */
export const getHsrMaterialImage = (materialId: string) => {
  return new URL(`../assets/img/hsr/materials/${materialId}.webp`, import.meta.url).toString()
}

/**
 * Gets relic set image URL.
 *
 * @param relicSetId Relic set ID
 * @returns Image URL
 */
export const getRelicSetImage = (relicSetId: string) => {
  return new URL(`../assets/img/hsr/relic-sets/${relicSetId}.webp`, import.meta.url).toString()
}

/**
 * Gets relic piece image URL.
 *
 * @param relicPieceId Relic piece ID
 * @returns Image URL
 */
export const getRelicPieceImage = (relicPieceId: string) => {
  return new URL(`../assets/img/relic-pieces/${relicPieceId}.webp`, import.meta.url).toString()
}

/**
 * Gets svg vector URL.
 *
 * @param fileName File name without extension
 */
export const getVector = (fileName: string) => {
  return new URL(`../assets/vectors/${fileName}.svg`, import.meta.url).toString()
}

/**
 * Gets element image URL.
 *
 * @param element Element name
 * @returns Image URL
 */
export const getElementImage = (element: GenshinElement) => {
  return new URL(`../assets/img/genshin/elements/${element}.webp`, import.meta.url).toString()
}
