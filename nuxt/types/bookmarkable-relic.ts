import {Bookmark} from "~/types/bookmark/bookmark"
import {Stat} from "~/types/generated/relic-stats.g"

export class BookmarkableRelicSet implements Omit<Bookmark.RelicSet, "id" | "bookmarkedAt"> {
  relicSetIds: string[]
  characterId: string
  variant: string | null
  mainStats: Record<string, Stat | null>
  subStats: Stat[]
  type = "relic_set" as const

  constructor(data: Omit<BookmarkableRelicSet, "id" | "bookmarkedAt" | "type">) {
    this.characterId = data.characterId
    this.mainStats = data.mainStats
    this.relicSetIds = data.relicSetIds
    this.subStats = data.subStats
    this.variant = data.variant
  }
}

export class BookmarkableRelicPiece implements Omit<Bookmark.RelicPiece, "id" | "bookmarkedAt"> {
  relicPieceId: string
  characterId: string
  variant: string | null
  mainStat: Stat | null
  subStats: Stat[]
  type = "relic_piece" as const

  constructor(data: Omit<BookmarkableRelicPiece, "id" | "bookmarkedAt" | "type">) {
    this.characterId = data.characterId
    this.mainStat = data.mainStat
    this.relicPieceId = data.relicPieceId
    this.subStats = data.subStats
    this.variant = data.variant
  }
}

export type BookmarkableRelic = BookmarkableRelicSet | BookmarkableRelicPiece
