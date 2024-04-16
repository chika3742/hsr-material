import type {Table, Transaction} from "dexie"
import {_db} from "~/dexie/db"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"

export abstract class DbProvider {
  protected async transactionWithFirestore<T>(tables: Table[], txnScope: (trans: Transaction) => T | PromiseLike<T>): Promise<T> {
    const backup = await _db.dump()

    return _db.transaction("rw", tables, txnScope).then(async(result) => {
      await FirestoreProvider.instance?.sendLocalData()

      return result
    }).catch((e) => {
      // restore backup
      void _db.import(backup)
      throw e
    })
  }
}
