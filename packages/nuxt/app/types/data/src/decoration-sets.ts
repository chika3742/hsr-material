import type { LocalizedText } from "../locales"

interface DecorationSetBase {
  id: string
  name: LocalizedText
  effects: { [type: string]: LocalizedText }
  yomi: string
}

export interface RelicSet extends DecorationSetBase {
  type: "cavern" | "planar"
}

export type DecorationSets = RelicSet[]
