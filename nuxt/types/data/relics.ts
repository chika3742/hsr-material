export interface RelicSet {
  id: string
  $nameJA: string
  yomi: string
  type: "cavern" | "planar"
}

export interface RelicPiece {
  id: string
  $nameJA: string
  yomi: string
  setId: string
}
