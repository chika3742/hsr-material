import type { LocalizedText } from "../locales"

export interface Material extends Record<string, unknown> {
  id: string
  name: LocalizedText
  yomi: string
  rarity: number
  category: string
  groupId?: string
  craftLevel?: number
}

export type Materials = Material[]
