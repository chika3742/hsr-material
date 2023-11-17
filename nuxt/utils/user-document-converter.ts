import type {FirestoreDataConverter, QueryDocumentSnapshot} from "@firebase/firestore"
import {Timestamp} from "@firebase/firestore"
import type {UserDocument} from "~/types/firestore/user-document"

export const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore: (modelObject: UserDocument) => modelObject,
  fromFirestore(snapshot: QueryDocumentSnapshot<UserDocument>): UserDocument {
    const data = snapshot.data()

    return {
      ...data,
      data: {
        warps: data.data.warps,
        bookmarks: data.data.bookmarks.map(bookmark => ({
          ...bookmark,
          // convert Timestamp to Date
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          bookmarkedAt: new Timestamp(bookmark.bookmarkedAt.seconds, bookmark.bookmarkedAt.nanoseconds).toDate(),
        })),
      },
    }
  },
}
