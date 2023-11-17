import type {Analytics} from "@firebase/analytics"
import {logEvent} from "@firebase/analytics"
import type {Bookmarkable} from "~/types/bookmark/bookmarkables"

export class EventLogger {
  constructor(public readonly analytics: Analytics) {
  }

  logBookmarkAdded(data: Bookmarkable) {
    this.logBookmarkToggleEvent(data, "bookmark_added")
  }

  logBookmarkRemoved(data: Bookmarkable) {
    this.logBookmarkToggleEvent(data, "bookmark_removed")
  }

  private logBookmarkToggleEvent(data: Bookmarkable, eventName: "bookmark_added" | "bookmark_removed") {
    logEvent(this.analytics, eventName, {
      item_type: data.type,
      character_id: data.characterId,
      item_id: (() => {
        switch (data.type) {
          case "character_material":
          case "light_cone_material":
            return data.materialId

          case "relic_set":
            return data.relicSetIds

          case "relic_piece":
            return data.relicPieceId
        }

        return undefined
      })(),
    })
  }
}
