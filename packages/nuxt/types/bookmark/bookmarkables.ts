import type { HsrRelicPosition, HsrStat } from "../data/enums"
import type { CharacterIdWithVariant } from "../data/src/characters"
import type { Bookmark } from "~/types/bookmark/bookmark"

export type BookmarkableCharacterMaterial = Omit<Bookmark.CharacterMaterial, "id" | "bookmarkedAt">
export type BookmarkableLightConeMaterial = Omit<Bookmark.LightConeMaterial, "id" | "bookmarkedAt">
export type BookmarkableExp = Omit<Bookmark.Exp, "id" | "bookmarkedAt" | "selectedItem">
export type BookmarkableMaterial = BookmarkableCharacterMaterial | BookmarkableLightConeMaterial
export type BookmarkableIngredient =
  | BookmarkableCharacterMaterial
  | BookmarkableLightConeMaterial
  | BookmarkableExp

export function isBookmarkableExp(item: BookmarkableIngredient): item is BookmarkableExp {
  return item.type === "character_exp" || item.type === "light_cone_exp"
}

export function isBookmarkableMaterial(item: BookmarkableIngredient): item is BookmarkableMaterial {
  return item.type === "character_material" || item.type === "light_cone_material"
}

export class BookmarkableRelicSet implements Omit<Bookmark.RelicSet, "id" | "bookmarkedAt"> {
  relicSetIds: string[]
  characterId: CharacterIdWithVariant
  mainStats: Partial<Record<HsrRelicPosition, HsrStat | null>>
  subStats: HsrStat[]
  type = "relic_set" as const

  constructor(data: Omit<BookmarkableRelicSet, "id" | "bookmarkedAt" | "type">) {
    this.characterId = data.characterId
    this.mainStats = data.mainStats
    this.relicSetIds = data.relicSetIds
    this.subStats = data.subStats
  }
}

export class BookmarkableRelicPiece implements Omit<Bookmark.RelicPiece, "id" | "bookmarkedAt"> {
  relicPieceId: string
  characterId: CharacterIdWithVariant
  mainStat: HsrStat | null
  subStats: HsrStat[]
  type = "relic_piece" as const

  constructor(data: Omit<BookmarkableRelicPiece, "id" | "bookmarkedAt" | "type">) {
    this.characterId = data.characterId
    this.mainStat = data.mainStat
    this.relicPieceId = data.relicPieceId
    this.subStats = data.subStats
  }
}

export type BookmarkableRelic = BookmarkableRelicSet | BookmarkableRelicPiece

export type Bookmarkable = BookmarkableIngredient | BookmarkableRelic
