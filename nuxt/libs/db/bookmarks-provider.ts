import {Table} from "dexie"
import {logEvent} from "@firebase/analytics"
import {Bookmark, LevelingBookmark, RelicBookmark} from "~/types/bookmark/bookmark"
import {BookmarkableRelic} from "~/types/bookmarkable-relic"
import {
  BookmarkableCharacterMaterial,
  BookmarkableExp,
  BookmarkableIngredient,
  BookmarkableLightConeMaterial,
  isBookmarkableExp,
} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"
import {_db} from "~/dexie/db"
import {DbProvider} from "~/libs/db/db-provider"

/**
 * Provides methods for bookmark-related database operations.
 */
export class BookmarksProvider extends DbProvider {
  bookmarks: Table<Bookmark>

  constructor() {
    super()
    this.bookmarks = _db.bookmarks
  }

  /**
   * Gets list of {@link LevelingBookmark} corresponding to the given items.
   * Mainly used for bookmark button on material card.
   *
   * @param items Items to get bookmarks for
   * @param purposeTypes Purpose types to filter by (only for character materials)
   * @param upperLevel Upper level to filter by
   * @returns List of {@link LevelingBookmark}
   */
  getLevelingItems(items: BookmarkableIngredient[], purposeTypes: PurposeType[], upperLevel?: number) {
    const firstItem = items[0]
    // query all bookmarks with the same characterId
    return this.bookmarks.where("characterId").equals(firstItem.characterId)
      .and((e) => {
        // filter by type
        if (e.type !== firstItem.type) {
          return false
        }

        // For individual bookmarks, filter by upperLevel
        if (typeof upperLevel !== "undefined" && e.usage.upperLevel !== upperLevel) {
          return false
        }

        /* `characterId`, `variant`, and `type` already filtered */

        // change filter by type
        switch (e.type) {
          case "character_exp":
          case "light_cone_exp": {
            const item = firstItem as BookmarkableExp // e.type and firstItem.type are the same
            // lightConeId is same (materialId is unrelated, characterId and variant is already filtered)
            return e.usage.lightConeId === item.usage.lightConeId
          }
          case "character_material": {
            const item = firstItem as BookmarkableCharacterMaterial // e.type and firstItem.type are the same
            // materialId is same and purposeType is in purposeTypes (characterId and variant is already filtered)
            return e.materialId === item.materialId && purposeTypes.includes(e.usage.purposeType)
          }
          case "light_cone_material": {
            const item = firstItem as BookmarkableLightConeMaterial // e.type and firstItem.type are the same
            // materialId and lightConeId is same (characterId and variant is already filtered)
            return e.materialId === item.materialId &&
              e.usage.lightConeId === item.usage.lightConeId &&
              e.usage.purposeType === item.usage.purposeType // for convenience (currently it can only be one type)
          }
        }
      }).toArray() as Promise<LevelingBookmark[]>
  }

  getByPurpose(characterId: string, variant: string | null, lightConeId: string | undefined, purposeType: PurposeType) {
    return this.bookmarks.where("characterId").equals(toCharacterIdWithVariant(characterId, variant))
      .and((e) => {
        const item = e as BookmarkableIngredient

        switch (item.type) {
          case "character_exp":
          case "character_material":
            // filtered by characterId, variant, and purposeType
            return item.usage.purposeType === purposeType
          case "light_cone_exp":
          case "light_cone_material":
            // filtered by characterId, variant, lightConeId, and purposeType
            return item.usage.lightConeId === lightConeId && item.usage.purposeType === purposeType
        }
      }).toArray() as Promise<LevelingBookmark[]>
  }

  /**
   * Adds {@link LevelingBookmark}s to the database.
   *
   * @param data List of {@link LevelingBookmark}s to add
   * @param selectedItem Selected item (only for exp)
   */
  addLevelingItems<T extends BookmarkableIngredient>(data: T[], selectedItem: T extends BookmarkableExp ? string : undefined) {
    return this.transactionWithFirestore([this.bookmarks], async() => {
      const dataToSave: LevelingBookmark[] = data.map((e) => {
        if (isBookmarkableExp(e)) {
          return {
            ...e,
            bookmarkedAt: new Date(),
            selectedItem,
          } as Bookmark.Exp
        }

        return {
          ...e,
          bookmarkedAt: new Date(),
        } as Bookmark.CharacterMaterial | Bookmark.LightConeMaterial
      })

      // add bookmarks
      await this.bookmarks.bulkAdd(dataToSave, {allKeys: true})
    }).then(() => {
      const {$analytics} = useNuxtApp()
      logEvent($analytics, "bookmark_added", {
        item_type: data[0].type,
        character_id: data[0].characterId,
        item_id: !isBookmarkableExp(data[0]) ? data[0].materialId : undefined,
      })

      return null
    })
  }

  /**
   * Removes {@link LevelingBookmark}s from the database.
   *
   * @param ids List of ids to remove
   */
  remove(...ids: number[]) {
    return this.transactionWithFirestore([this.bookmarks], async() => {
      const item = await this.bookmarks.get(ids[0])
      if (item) {
        const {$analytics} = useNuxtApp()
        logEvent($analytics, "bookmark_removed", {
          item_type: item.type,
          character_id: item.characterId,
          item_id: (() => {
            switch (item.type) {
              case "character_material":
              case "light_cone_material":
                return item.materialId

              case "relic_set":
                return item.relicSetIds

              case "relic_piece":
                return item.relicPieceId
            }

            return undefined
          })(),
        })
      }

      await this.bookmarks.bulkDelete(ids)
    })
  }

  addRelic(data: BookmarkableRelic) {
    return this.transactionWithFirestore([this.bookmarks], async() => {
      const dataToSave: RelicBookmark = {
        ...data,
        bookmarkedAt: new Date(),
      }

      // add bookmark
      await this.bookmarks.add(dataToSave)
    }).then(() => {
      const {$analytics} = useNuxtApp()
      logEvent($analytics, "bookmark_added", {
        item_type: data.type,
        character_id: data.characterId,
        item_id: data.type === "relic_set" ? data.relicSetIds : data.relicPieceId,
      })

      return null
    })
  }
}
