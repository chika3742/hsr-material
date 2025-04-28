import type { HsrCombatType, HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredient"

interface CharacterBase {
  id: string
  $nameJA: string
  yomi: string
  rarity: number
}

interface CharacterWithVariantsBase<T> extends CharacterBase {
  variants: (T & {
    materials: Record<string, MaterialExpr>
    levelingItemTable?: string
  })[]
}

interface CharacterWithoutVariantsBase extends CharacterBase {
  materials: Record<string, MaterialExpr>
  levelingItemTable?: string
}

interface HsrCharacterMixin {
  path: HsrPath
  combatType: HsrCombatType
}

/** Character for HSR w/ variants */
export type HsrCharacterWV = CharacterWithVariantsBase<HsrCharacterMixin>
/** Character for HSR w/o variants */
export type HsrCharacterWoV = (CharacterWithoutVariantsBase & HsrCharacterMixin)
export type HsrCharacter = HsrCharacterWV | HsrCharacterWoV

export type Characters = HsrCharacter[]
