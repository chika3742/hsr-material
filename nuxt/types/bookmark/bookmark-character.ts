import {CharacterIdWithVariant} from "~/types/strings"

export interface BookmarkCharacter {
  characterId: CharacterIdWithVariant
  bookmarks: BookmarkId[]
}

export type BookmarkId = number
