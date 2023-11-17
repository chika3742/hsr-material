import type {Stat} from "~/types/generated/relic-stats.g"
import type {Usage} from "~/types/bookmark/usage"
import type {CharacterIdWithVariant} from "~/types/strings"

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
    characterId: CharacterIdWithVariant
    materialId: string
    usage: Usage.Character
    quantity: number
    hash: string
  }

  export interface LightConeMaterial {
    id?: number
    type: "light_cone_material"
    bookmarkedAt: Date
    characterId: CharacterIdWithVariant
    materialId: string
    usage: Usage.LightCone
    quantity: number
    hash: string
  }

  export interface Exp {
    id?: number
    type: "character_exp" | "light_cone_exp"
    bookmarkedAt: Date
    characterId: CharacterIdWithVariant
    usage: Usage.Exp
    exp: number
    selectedItem: string
    hash: string
  }

  export interface RelicSet {
    id?: number
    type: "relic_set"
    bookmarkedAt: Date
    characterId: CharacterIdWithVariant
    relicSetIds: string[]
    mainStats: Record<string, Stat | null>
    subStats: Stat[]
  }

  export interface RelicPiece {
    id?: number
    type: "relic_piece"
    bookmarkedAt: Date
    characterId: CharacterIdWithVariant
    relicPieceId: string
    mainStat: Stat | null
    subStats: Stat[]
  }
}
