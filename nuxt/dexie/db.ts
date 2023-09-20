import Dexie, {Table} from "dexie"
import {Warp} from "#shared/warp"
import {Bookmark} from "~/types/bookmark/bookmark"
import {SyncedUserData, UserDocument} from "~/types/firestore/user-document"
import {DataSyncError} from "~/libs/data-sync-error"
import {migrate} from "~/utils/migrate"

export class MySubClassedDexie extends Dexie {
  bookmarks!: Table<Bookmark>
  warps!: Table<Warp>

  constructor() {
    super("hsr_material")
    this.version(1).stores({
      bookmarkCharacters: "characterId, *bookmarks",
      bookmarks: "++id, usage.characterId",
      warps: "id, gachaType",
    })

    this.version(2).stores({
      bookmarkCharacters: null,
      bookmarks: "++id, characterId",
    }).upgrade(async() => {
      await this.import(migrate(await this.dump(), 1, 2))
    })
  }

  dump() {
    return this.transaction("r", this.tables, () => {
      return Promise.all(this.tables.map(table => table.toArray()
        .then(result => [table.name, result] as const)))
    }).then(result => Object.fromEntries(result)) as Promise<SyncedUserData>
  }

  import(data: SyncedUserData) {
    return this.transaction("rw", this.tables, () => {
      return Object.entries(data).map(async([tableName, tableData]) => {
        const table = this.table(tableName)
        await table.clear()
        return await table.bulkAdd(tableData as unknown[])
      })
    })
  }

  importRemote(data: UserDocument) {
    let userData = data.data

    if (data.schemaVersion > this.verno) {
      // remote schema version is newer than local schema version
      throw new DataSyncError("mnt/schema-ver-mismatch", "Remote schema version is newer than local schema version")
    } else if (data.schemaVersion < this.verno) {
      // remote schema version is older than local schema version
      userData = migrate(userData, data.schemaVersion, this.verno)
    }

    return this.import(userData)
  }
}

/**
 * Internal Dexie instance. This can also be used to create observable queries.
 */
export const _db = new MySubClassedDexie()
