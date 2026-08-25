import type { LevelsForPurposeTypes } from "~/types/level-ingredients"

export type PurposeType = keyof LevelsForPurposeTypes

export const purposeTypeList: PurposeType[] = ["ascension", "basicAttack", "skill", "ultimate", "talent", "memospriteSkill", "memospriteTalent"]

export type ThemeSetting = "auto" | "light" | "dark"

export type PossessionStatus = "owned" | "notOwned"
