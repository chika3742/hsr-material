export interface DropRateEntry {
  /** I18n key for the type of drops */
  readableType?: string
  ids?: string[]
  type?: "character_ascension" | "light_cone_or_skill_upgrade" | "advanced_skill_upgrade"
  craftFactors?: {
    rarities: Record<string, number>
  }
  isChallengeableConsecutively: boolean
  drops: {
    equilibriumLevels: number[]
    rarities: Record<string, number>
  }[]
}

export type DropRates = DropRateEntry[]
