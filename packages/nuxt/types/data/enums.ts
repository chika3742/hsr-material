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

export const hsrStats = [
  "hp",
  "atk",
  "def",
  "hp_percent",
  "atk_percent",
  "def_percent",
  "crit_rate",
  "crit_dmg",
  "outgoing_healing",
  "effect_hit_rate",
  "speed",
  "physical_dmg",
  "fire_dmg",
  "ice_dmg",
  "lightning_dmg",
  "wind_dmg",
  "quantum_dmg",
  "imaginary_dmg",
  "break_effect",
  "energy_regen_rate",
  "effect_res",
] as const
export type HsrStat = (typeof hsrStats)[number]

export const hsrRelicPositions = [
  "head",
  "hands",
  "body",
  "feet",
  "planar_sphere",
  "link_rope",
] as const
export type HsrRelicPosition = (typeof hsrRelicPositions)[number]

export const genshinElements = [
  "pyro",
  "hydro",
  "electro",
  "dendro",
  "cryo",
  "geo",
  "anemo",
] as const
export type GenshinElement = (typeof genshinElements)[number]

export const genshinWeaponTypes = [
  "sword",
  "claymore",
  "polearm",
  "bow",
  "catalyst",
] as const
export type GenshinWeaponType = (typeof genshinWeaponTypes)[number]

export const genshinPurposeTypes = [
  "ascension",
  "basicAttack",
  "elementalSkill",
  "elementalBurst",
] as const
export type GenshinPurposeType = (typeof genshinPurposeTypes)[number]
