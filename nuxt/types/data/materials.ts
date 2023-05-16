export type MaterialCategory =
  | "exp"
  | "character_ascension"
  | "light_cone_or_skill_upgrade"
  | "common"
  | "advanced_skill_upgrade"
  | "others"

export interface Material {
  id: string
  $nameJA: string
  yomi?: string
  rarity: number
  category: MaterialCategory
  groupId?: string
  craftLevel?: number
}

export type Materials = Material[]
