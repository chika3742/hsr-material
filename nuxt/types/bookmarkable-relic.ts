import {Bookmark} from "~/types/bookmark/bookmark"
import {Stat} from "~/types/generated/relic-stats.g"
import {CharacterIdWithVariant} from "~/types/strings"

export class BookmarkableRelicSet implements Omit<Bookmark.RelicSet, "id" | "bookmarkedAt"> {
  relicSetIds: string[]
  characterId: CharacterIdWithVariant
  mainStats: Record<string, Stat | null>
  subStats: Stat[]
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
  mainStat: Stat | null
  subStats: Stat[]
  type = "relic_piece" as const

  constructor(data: Omit<BookmarkableRelicPiece, "id" | "bookmarkedAt" | "type">) {
    this.characterId = data.characterId
    this.mainStat = data.mainStat
    this.relicPieceId = data.relicPieceId
    this.subStats = data.subStats
  }
}

export type BookmarkableRelic = BookmarkableRelicSet | BookmarkableRelicPiece
