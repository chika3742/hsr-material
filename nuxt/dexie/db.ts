import Dexie, {Table} from "dexie"
import {Warp} from "#shared/warp"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
import {Bookmark} from "~/types/bookmark/bookmark"

export class MySubClassedDexie extends Dexie {
  /**
   * Characters that have bookmarks (for redundancy)
   */
  bookmarkCharacters!: Table<BookmarkCharacter>
  bookmarks!: Table<Bookmark>
  warps!: Table<Warp>

  constructor() {
    super("hsr_material")
    this.version(1).stores({
      bookmarkCharacters: "characterId, *bookmarks",
      bookmarks: "++id, usage.characterId",
      warps: "id, gachaType",
    })
  }
}

/**
 * Internal Dexie instance. This can also be used to create observable queries.
 */
export const _db = new MySubClassedDexie()
