import {Timestamp} from "@firebase/firestore"
import {Warp} from "#shared/warp"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
import {Bookmark} from "~/types/bookmark/bookmark"

export interface UserDocument {
  schemaVersion: number
  savedAt: Timestamp
  data: SyncUserData
}

export interface SyncUserData {
  bookmarkCharacters: BookmarkCharacter[]
  bookmarks: Bookmark[]
  warps: Warp[]
}
