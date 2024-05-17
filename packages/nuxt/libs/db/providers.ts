import { BookmarksProvider } from "~/libs/db/bookmarks-provider"
import { WarpsProvider } from "~/libs/db/warps-provider"

/**
 * Provides access to all database providers.
 */
export class Providers {
  get bookmarks() {
    return new BookmarksProvider()
  }

  get warps() {
    return new WarpsProvider()
  }
}

/**
 * Provides access to all database providers.
 */
export const db = new Providers()
