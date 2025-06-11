import { omit, uniqBy } from "lodash-es"
import hash from "object-hash"
import type { SyncedUserData } from "~/types/firestore/user-document"

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
      bookmark.hash = hash(omit(bookmark, ["id", "bookmarkedAt", "selectedItem"]))
    }

    oldVersion++
  }

  if (oldVersion === 3) {
    for (const bookmark of data.bookmarks) {
      if (!["character_material", "character_exp"].includes(bookmark.type) || bookmark.characterId !== "march-7th") {
        continue
      }
      bookmark.characterId = "march-7th_preservation"
      bookmark.hash = hash(omit(bookmark, ["id", "bookmarkedAt", "selectedItem", "hash"]))
    }
    oldVersion++
  }

  if (oldVersion === 4) {
    // Migrate ascension bookmarks for Trailblazer and March 7th
    const characterIdMap: Record<string, string> = {
      "trailblazer_destruction": "trailblazer",
      "trailblazer_preservation": "trailblazer",
      "trailblazer_harmony": "trailblazer",
      "trailblazer_remembrance": "trailblazer",
      "march-7th_preservation": "march-7th",
      "march-7th_the_hunt": "march-7th",
    }

    for (const bookmark of data.bookmarks) {
      if (["character_material", "character_exp"].includes(bookmark.type)
        && bookmark.usage.purposeType === "ascension"
        && Object.keys(characterIdMap).includes(bookmark.characterId)) {
        bookmark.characterId = characterIdMap[bookmark.characterId]
        bookmark.hash = hash(omit(bookmark, ["id", "bookmarkedAt", "selectedItem", "hash"]))
      }
    }
    // remove duplicates
    data.bookmarks = uniqBy<any>(data.bookmarks, e => e.hash)

    oldVersion++
  }

  if (oldVersion === 5) {
    // Migrate EXP materials to use expItemGroup
    for (const bookmark of data.bookmarks) {
      if (bookmark.type === "character_exp") {
        bookmark.expItemGroup = "character"
      }
      if (bookmark.type === "light_cone_exp") {
        bookmark.expItemGroup = "lightCone"
      }
    }
  }

  return data as SyncedUserData
}
