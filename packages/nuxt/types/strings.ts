import type { Path } from "~/types/generated/characters.g"
import type { LevelsForPurposeTypes } from "~/types/level-ingredients"

export type PurposeType = keyof LevelsForPurposeTypes

export const purposeTypeList: PurposeType[] = ["ascension", "skill", "ultimate", "talent", "memospriteSkill", "memospriteTalent"]

export type CharacterIdWithVariant = string | `${string}_${Path}`
