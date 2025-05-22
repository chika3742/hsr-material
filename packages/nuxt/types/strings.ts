import type { HsrPath } from "./data/enums"
import type { LevelsForPurposeTypes } from "~/types/level-ingredients"

export type PurposeType = keyof LevelsForPurposeTypes

export const purposeTypeList: PurposeType[] = ["ascension", "basicAttack", "skill", "ultimate", "talent", "memospriteSkill", "memospriteTalent"]

export type CharacterIdWithVariant = string | `${string}_${HsrPath}`
