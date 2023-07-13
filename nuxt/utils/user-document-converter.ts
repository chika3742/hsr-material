import {FirestoreDataConverter, QueryDocumentSnapshot, Timestamp} from "@firebase/firestore"
import {UserDocument} from "~/types/firestore/user-document"

/**
 * Creates a FirestoreDataConverter that does not convert anything. This only
 */
export const userDocumentConverter = (): FirestoreDataConverter<UserDocument> => {
  return {
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
            bookmarkedAt: new Timestamp(bookmark.bookmarkedAt.seconds, bookmark.bookmarkedAt.nanoseconds).toDate(),
          })),
        },
      }
    },
  }
}
