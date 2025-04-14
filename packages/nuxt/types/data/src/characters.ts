import type { HsrCombatType, HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredients"

interface CharacterBase<T> {
  id: string
  $nameJA: string
  yomi: string
  rarity: number
  materials?: Record<string, MaterialExpr>
  levelingItemTable?: string
  variants?: (T & {
    materials: Record<string, MaterialExpr>
    levelingItemTable?: string
  })[]
}

export interface HsrCharacter extends CharacterBase<HsrCharacter> {
  path?: HsrPath
  combatType?: HsrCombatType
}

export type Characters = HsrCharacter[]
