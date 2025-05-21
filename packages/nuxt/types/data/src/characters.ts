import type { HsrCombatType, HsrPath, HsrPurposeType } from "../enums"
import type { MaterialExpr } from "../ingredient"
import type { LocalizedText } from "../locales"

interface CharacterBase {
  id: string
  name: LocalizedText
  yomi: string
  rarity: number
}

export interface CharacterSkill {
  name: LocalizedText
}

type CharacterVariant<T> = T & {
  name: LocalizedText
  materials: Record<string, MaterialExpr>
  skills: { [k in Exclude<HsrPurposeType, "ascension">]?: CharacterSkill }
  ingredientsTable?: string
}

interface CharacterWithVariantsBase<T> extends CharacterBase {
  variants: CharacterVariant<T>[]
}

type CharacterWithoutVariantsBase<T> = CharacterBase & CharacterVariant<T>

interface HsrCharacterMixin {
  path: HsrPath
  combatType: HsrCombatType
}

/** Character for HSR w/ variants */
export type HsrCharacterWV = CharacterWithVariantsBase<HsrCharacterMixin>
export type HsrCharacterVariant = CharacterVariant<HsrCharacterMixin>
/** Character for HSR w/o variants */
export type HsrCharacterWoV = CharacterWithoutVariantsBase<HsrCharacterMixin>
export type HsrCharacter = HsrCharacterWV | HsrCharacterWoV

export type Characters = HsrCharacter[]

/** `character` is a character group = `character` has variants */
export const isCharacterGroup = <T>(x: CharacterWithVariantsBase<T> | CharacterWithoutVariantsBase<T>): x is CharacterWithVariantsBase<T> => {
  return "variants" in x
}
