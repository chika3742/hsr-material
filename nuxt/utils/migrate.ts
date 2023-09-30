/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {SyncedUserData} from "~/types/firestore/user-document"

export const migrate = (data: { [table: string]: any }, oldVersion: number, newVersion: number): SyncedUserData => {
  if (oldVersion === 1 && newVersion >= 2) {
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

  return data as SyncedUserData
}
