export const hsrPaths = [
  "destruction",
  "the_hunt",
  "erudition",
  "harmony",
  "nihility",
  "preservation",
  "abundance",
  "remembrance",
] as const
export type HsrPath = (typeof hsrPaths)[number]

export const hsrCombatTypes = [
  "physical",
  "fire",
  "ice",
  "lightning",
  "wind",
  "quantum",
  "imaginary",
] as const
export type HsrCombatType = (typeof hsrCombatTypes)[number]

export const hsrPurposeTypes = [
  "ascension",
  "basicAttack",
  "skill",
  "ultimate",
  "talent",
  "memospriteSkill",
  "memospriteTalent",
] as const
export type HsrPurposeType = (typeof hsrPurposeTypes)[number]
