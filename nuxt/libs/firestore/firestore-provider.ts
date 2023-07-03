import {doc, DocumentReference, Firestore, getDoc, setDoc, Timestamp} from "@firebase/firestore"
import {User} from "@firebase/auth"
import {UserDocument} from "~/types/firestore/user-document"
import {simpleFirestoreConverter} from "~/utils/simple-firestore-converter"
import {MySubClassedDexie} from "~/dexie/db"
import {DataSyncError} from "~/libs/data-sync-error"

export class FirestoreProvider {
  readonly userDoc: DocumentReference<UserDocument>

  constructor(
    public readonly user: User,
    public readonly firestore: Firestore,
    public readonly db: MySubClassedDexie,
  ) {
    this.userDoc = doc(this.firestore, "users", this.user.uid)
      .withConverter(simpleFirestoreConverter<UserDocument>())
  }

  async fetch(): Promise<UserDocument | undefined> {
    const doc = await getDoc(this.userDoc)
    return doc.data()
  }

  async sendLocalData(): Promise<void> {
    const data = await this.db.dump()

    await setDoc(this.userDoc, {
      schemaVersion: this.db.verno,
      savedAt: Timestamp.now(),
      data,
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
    // remote schema version is newer than local schema version
    if (remoteData.schemaVersion > this.db.verno) {
      throw new DataSyncError("mnt/schema-ver-mismatch", "Remote schema version is newer than local schema version")
    }

    const localData = await this.db.dump()
    // local data is empty
    if (Object.values(localData).every(v => v.length === 0)) {
      await this.db.import(remoteData.data)
      return
    }

    // remote data exists and local data is not empty
    throw new DataSyncError("mnt/conflict", "Local data exists and remote data exists")
  }
}
