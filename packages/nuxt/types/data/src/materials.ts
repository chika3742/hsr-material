import type { LocalizedText } from "../locales"

export interface Material {
  id: string
  name: LocalizedText
  yomi: string
  rarity: number
  category: string
  groupId?: string
  craftLevel?: number
}

export type Materials = Material[]
