import {CombatType, Path} from "~/types/generated/characters.g"

/**
 * Gets character image URL.
 *
 * @param characterId Character ID
 * @param variant When `full`, returns 800x400 splash image. When `small`, returns icon image.
 * @returns Image URL
 */
export const getCharacterImage = (characterId: string, variant: "full" | "small"): string => {
  if (variant === "full") {
    return new URL(`../assets/img/characters/${characterId}.webp`, import.meta.url).toString()
  } else {
    return new URL(`../assets/img/characters/${characterId}_small.webp`, import.meta.url).toString()
  }
}

/**
 * Gets light cone image URL.
 *
 * @param lightConeId Light cone ID
 * @returns Image URL
 */
export const getLightConeImage = (lightConeId: string) => {
  return new URL(`../assets/img/light-cones/${lightConeId}.webp`, import.meta.url).toString()
}

/**
 * Gets combat type image URL.
 *
 * @param type Combat type
 * @returns Image URL
 */
export const getCombatTypeImage = (type: CombatType) => {
  return new URL(`../assets/img/combat-types/${type}.webp`, import.meta.url).toString()
}

/**
 * Gets path image URL.
 *
 * @param path Path
 * @returns Image URL
 */
export const getPathImage = (path: Path) => {
  return new URL(`../assets/img/paths/${path}.webp`, import.meta.url).toString()
}

/**
 * Gets material image URL.
 *
 * @param materialId Material ID
 * @returns Image URL
 */
export const getMaterialImage = (materialId: string) => {
  return new URL(`../assets/img/materials/${materialId}.webp`, import.meta.url).toString()
}
