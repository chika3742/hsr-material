import type { LocalizedText } from "../locales"

interface DecorationPieceBase {
  id: string
  name: LocalizedText
  yomi: string
  setId: string
}

export interface RelicPiece extends DecorationPieceBase {
  type: "head" | "hands" | "body" | "feet" | "link_rope" | "planar_sphere"
}

export type DecorationPieces = RelicPiece[]
