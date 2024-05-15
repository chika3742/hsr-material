/* eslint-disable @typescript-eslint/no-unsafe-argument */

import _ from "lodash"
import hash from "object-hash"
import type {SyncedUserData} from "~/types/firestore/user-document"

export const migrate = (data: { [table: string]: any }, oldVersion: number, newVersion: number): SyncedUserData => {
  if (oldVersion >= newVersion) {
    return data as SyncedUserData
  }

  if (oldVersion === 1) {
    for (const bookmark of data.bookmarks) {
      if ("usage" in bookmark) {
        bookmark.characterId = toCharacterIdWithVariant(bookmark.usage.characterId, bookmark.usage.variant)
        delete bookmark.usage.characterId
        delete bookmark.usage.variant
      } else {
        bookmark.characterId = toCharacterIdWithVariant(bookmark.characterId, bookmark.variant)
        delete bookmark.variant
      }
    }

    delete data.bookmarkCharacters
    oldVersion++
  }

  if (oldVersion === 2) {
    for (const bookmark of data.bookmarks) {
      if (!["character_material", "light_cone_material", "character_exp", "light_cone_exp"].includes(bookmark.type)) {
        continue
      }
      bookmark.hash = hash(_.omit(bookmark, ["id", "bookmarkedAt", "selectedItem"]))
    }

    oldVersion++
  }

  return data as SyncedUserData
}
