import type { LevelIngredients } from "~/types/level-ingredients"

export function clampLevelIngredients(levelIngredients: LevelIngredients[], minLevel: number, maxLevel: number): LevelIngredients[] {
  return levelIngredients.filter(({ level }) => level > minLevel && level <= maxLevel)
}
