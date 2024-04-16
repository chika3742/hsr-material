import type {DocumentReference, Firestore} from "@firebase/firestore"
import {doc, getDoc, onSnapshot, setDoc, Timestamp} from "@firebase/firestore"
import type {User} from "@firebase/auth"
import type {UserDocument} from "~/types/firestore/user-document"
import {configStoreToSyncedConfig} from "~/types/firestore/user-document"
import {userDocumentConverter} from "~/utils/user-document-converter"
import type {MySubClassedDexie} from "~/dexie/db"
import {DataSyncError} from "~/libs/data-sync-error"

export class FirestoreProvider {
  readonly userDoc: DocumentReference<UserDocument>

  static instance: FirestoreProvider | null = null
  /**
   * Set this to true to avoid overwriting local data with remote data when signing in.
   * ({@link listen} will be triggered by auth listener when signing in)
   */
  static blockListening = false
  private unsubscribe?: () => void

  constructor(
    public readonly user: User,
    public readonly firestore: Firestore,
    public readonly db: MySubClassedDexie,
  ) {
    this.userDoc = doc(this.firestore, "users", this.user.uid)
      .withConverter(userDocumentConverter)
  }

  async fetch(): Promise<UserDocument | undefined> {
    const doc = await getDoc(this.userDoc)
    return doc.data()
  }

  async sendLocalData(): Promise<void> {
    const data = await this.db.dump()
    const config = useConfigStore()

    await setDoc(this.userDoc, {
      schemaVersion: this.db.verno,
      savedAt: Timestamp.now(),
      data,
      config: configStoreToSyncedConfig(config),
    })
  }

  async initUser() {
    const remoteData = await this.fetch()
    // remote data does not exist
    if (typeof remoteData === "undefined") {
      await this.sendLocalData()
      return
    }

    // remote data exists

    const localData = await this.db.dump()
    // local data is empty
    if (Object.values(localData).every((v: Array<unknown>) => v.length === 0)) {
      await this.db.importRemote(remoteData)
      return
    }

    // remote data exists and local data is not empty
    throw new DataSyncError("mnt/conflict", "Local data exists and remote data exists")
  }

  listen(options: { cancelBlocking?: boolean } = {}): void {
    if (!options.cancelBlocking && FirestoreProvider.blockListening) {
      return
    }
    FirestoreProvider.blockListening = false

    this.unsubscribe = onSnapshot(this.userDoc, async(doc) => {
      if (!doc.metadata.hasPendingWrites) {
        const data = doc.data()!

        // import into IndexedDB
        await this.db.importRemote(data)

        // import into config store
        const config = useConfigStore()
        Object.assign(config, data.config)
      }
    }, (error) => {
      console.error(error)

      useSnackbar().show("サーバーとの接続が切断されました。", "error")
    })
  }

  unListen() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = undefined
    }
  }
}
