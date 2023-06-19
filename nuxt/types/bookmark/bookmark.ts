import {Stat} from "~/types/generated/relic-stats.g"
import {Usage} from "~/types/bookmark/usage"

export type Bookmark =
  | Bookmark.CharacterMaterial
  | Bookmark.LightConeMaterial
  | Bookmark.Exp
  | Bookmark.RelicSet
  | Bookmark.RelicPiece

export type LevelingBookmark = Bookmark.CharacterMaterial | Bookmark.LightConeMaterial | Bookmark.Exp

export type RelicBookmark = Bookmark.RelicSet | Bookmark.RelicPiece

export namespace Bookmark {
  export interface CharacterMaterial {
    id?: number
    type: "character_material"
    bookmarkedAt: Date
    materialId: string
    usage: Usage.Character
    quantity: number
  }

  export interface LightConeMaterial {
    id?: number
    type: "light_cone_material"
    bookmarkedAt: Date
    materialId: string
    usage: Usage.LightCone
    quantity: number
  }

  export interface Exp {
    id?: number
    type: "exp"
    bookmarkedAt: Date
    usage: Usage.Exp
    exp: number
    selectedItem: string
  }

  export interface RelicSet {
    id?: number
    type: "relic_set"
    bookmarkedAt: Date
    characterId: string
    variant: string | null
    relicSetIds: string[]
    mainStats: Record<string, Stat | null>
    subStats: Stat[]
  }

  export interface RelicPiece {
    id?: number
    type: "relic_piece"
    bookmarkedAt: Date
    characterId: string
    variant: string | null
    relicPieceId: string
    mainStat: Stat | null
    subStats: Stat[]
  }
}
