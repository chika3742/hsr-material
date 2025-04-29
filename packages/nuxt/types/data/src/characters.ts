import type { HsrCombatType, HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredient"

interface CharacterBase {
  id: string
  $nameJA: string
  yomi: string
  rarity: number
}

type CharacterVariant<T> = (T & {
  materials: Record<string, MaterialExpr>
  levelingItemTable?: string
})

interface CharacterWithVariantsBase<T> extends CharacterBase {
  variants: CharacterVariant<T>[]
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
export type HsrCharacterVariant = CharacterVariant<HsrCharacterMixin>
/** Character for HSR w/o variants */
export type HsrCharacterWoV = (CharacterWithoutVariantsBase & HsrCharacterMixin)
export type HsrCharacter = HsrCharacterWV | HsrCharacterWoV

export type Characters = HsrCharacter[]

/** `character` is a character group = `character` has variants */
export const isCharacterGroup = <T>(x: CharacterWithVariantsBase<T> | CharacterWithoutVariantsBase): x is CharacterWithVariantsBase<T> => {
  return "variants" in x
}
