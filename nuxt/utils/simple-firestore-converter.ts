import {DocumentData, FirestoreDataConverter} from "@firebase/firestore"

/**
 * Creates a FirestoreDataConverter that does not convert anything. This only
 */
export const simpleFirestoreConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => {
  return {
    toFirestore: (modelObject: T) => modelObject,
    fromFirestore: snapshot => snapshot.data() as T,
  }
}
