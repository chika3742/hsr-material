import Dexie, {Table} from "dexie"
import {Warp} from "#shared/warp"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
import {Bookmark} from "~/types/bookmark/bookmark"
import {SyncUserData} from "~/types/firestore/user-document"

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

  dump() {
    return this.transaction("r", this.tables, () => {
      return Promise.all(this.tables.map(table => table.toArray()
        .then(result => [table.name, result] as const)))
    }).then(result => Object.fromEntries(result)) as Promise<SyncUserData>
  }

  import(data: SyncUserData) {
    return this.transaction("rw", this.tables, () => {
      return Object.entries(data).map(([tableName, tableData]) => {
        const table = this.table(tableName)
        return table.clear().then(() => table.bulkAdd(tableData))
      })
    })
  }
}

/**
 * Internal Dexie instance. This can also be used to create observable queries.
 */
export const _db = new MySubClassedDexie()
