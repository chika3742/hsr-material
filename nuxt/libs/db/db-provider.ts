import {Table, Transaction} from "dexie"
import {_db} from "~/dexie/db"
import {FirestoreProvider} from "~/libs/firestore/firestore-provider"

export abstract class DbProvider {
  protected async transactionWithFirestore<T>(tables: Table[], txnScope: (trans: Transaction) => T | PromiseLike<T>): Promise<void> {
    const backup = await _db.dump()

    return _db.transaction("rw", tables, txnScope).then(() => {
      return FirestoreProvider.instance?.sendLocalData()
    }).catch((e) => {
      // restore backup
      _db.import(backup)
      throw e
    })
  }
}
