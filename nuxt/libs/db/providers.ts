import {BookmarksProvider} from "~/libs/db/bookmarks-provider"

/**
 * Provides access to all database providers.
 */
export class Providers {
  get bookmarks() {
    return new BookmarksProvider()
  }
}

/**
 * Provides access to all database providers.
 */
export const db = new Providers()
