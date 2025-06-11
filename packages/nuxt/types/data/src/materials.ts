import type { LocalizedText } from "../locales"

export interface Material {
  id: string
  name: LocalizedText
  yomi: string
  imageUrl: string
  rarity: number
  category: string
  groupId?: string
  craftLevel?: number
  source?: MaterialSource
}

export type MaterialSource = TeyvatMapSource | TextSource

export interface TeyvatMapSource {
  runtimeType: "teyvatMap"
  typeId: string
  center: string
}

export interface TextSource {
  runtimeType: "text"
  text: LocalizedText
}

export type Materials = Material[]
