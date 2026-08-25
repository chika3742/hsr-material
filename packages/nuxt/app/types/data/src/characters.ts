import type { HsrCombatType, HsrPath, HsrPurposeType } from "../enums"
import type { MaterialExpr } from "../ingredient"
import type { LocalizedText } from "../locales"

export type CharacterId = string
export type CharacterVariantId = string
export type CharacterIdWithVariant = string | `${CharacterId}_${CharacterVariantId}`
export type CharacterIdWithOrWithoutVariant = CharacterId | CharacterIdWithVariant

interface CharacterBase {
  id: CharacterId
  name: LocalizedText
  yomi: string
  rarity: number
}

export interface CharacterSkill {
  name: LocalizedText
}

type CharacterSpecs<T> = T & {
  name: LocalizedText
  materials: Record<string, MaterialExpr>
  skills: { [k in Exclude<HsrPurposeType, "ascension">]?: CharacterSkill }
  ingredientsTable?: string
}

type CharacterVariant<T> = CharacterSpecs<T> & {
  variantId: CharacterVariantId
}

interface CharacterGroupBase<T> extends CharacterBase {
  variants: CharacterVariant<T>[]
}

type CharacterWithoutVariantsBase<T> = CharacterBase & CharacterSpecs<T>

interface HsrCharacterMixin {
  path: HsrPath
  combatType: HsrCombatType
}

/** Character for HSR w/ variants */
export type HsrCharacterGroup = CharacterGroupBase<HsrCharacterMixin>
export type HsrCharacterSpecs = CharacterSpecs<HsrCharacterMixin>
/** Character for HSR w/o variants */
export type VariantlessHsrCharacter = CharacterWithoutVariantsBase<HsrCharacterMixin>
export type HsrCharacter = HsrCharacterGroup | VariantlessHsrCharacter

export type Characters = HsrCharacter[]

/** `character` is a character group = `character` has variants */
export const isCharacterGroup = <T>(x: CharacterBase): x is CharacterGroupBase<T> => {
  return "variants" in x
}
