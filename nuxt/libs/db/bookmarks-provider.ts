import {Table} from "dexie"
import {Bookmark, LevelingBookmark, RelicBookmark} from "~/types/bookmark/bookmark"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
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
  bookmarkCharacters: Table<BookmarkCharacter>

  constructor() {
    super()
    this.bookmarks = _db.bookmarks
    this.bookmarkCharacters = _db.bookmarkCharacters
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
    return this.bookmarks.where("usage.characterId").equals(firstItem.usage.characterId)
      .and((e) => {
        // filter by type and variant
        if (e.type !== firstItem.type || e.usage.variant !== firstItem.usage.variant) {
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
    return this.bookmarks.where("usage.characterId").equals(characterId)
      .and((e) => {
        const item = e as BookmarkableIngredient

        if (item.usage.variant !== variant) {
          return false
        }

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
   * Adds {@link LevelingBookmark}s to the database. Also adds bookmark ids to {@link BookmarkCharacter}.
   *
   * @param data List of {@link LevelingBookmark}s to add
   * @param selectedItem Selected item (only for exp)
   */
  addLevelingItems<T extends BookmarkableIngredient>(data: T[], selectedItem: T extends BookmarkableExp ? string : undefined) {
    return this.transactionWithFirestore([this.bookmarks, this.bookmarkCharacters], async() => {
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
      const ids = (await this.bookmarks.bulkAdd(dataToSave, {allKeys: true})) as number[]

      // add bookmark ids to bookmarkCharacters
      const characterId = toCharacterIdWithVariant(data[0].usage.characterId, data[0].usage.variant)
      const bookmarkCharacter = await this.bookmarkCharacters.get(characterId)
      if (bookmarkCharacter) {
        await this.bookmarkCharacters.update(characterId, {
          bookmarks: bookmarkCharacter.bookmarks.concat(ids),
        })
      } else {
        await this.bookmarkCharacters.add({
          characterId,
          bookmarks: ids,
        })
      }
    })
  }

  /**
   * Removes {@link LevelingBookmark}s from the database. Also removes bookmark ids from {@link BookmarkCharacter}.
   *
   * @param ids List of ids to remove
   */
  remove(...ids: number[]) {
    return this.transactionWithFirestore([this.bookmarks, this.bookmarkCharacters], async() => {
      await this.bookmarks.bulkDelete(ids)

      // remove bookmark ids from bookmarkCharacters
      await this.bookmarkCharacters.where("bookmarks").anyOf(ids).modify((bookmarkCharacter) => {
        bookmarkCharacter.bookmarks = bookmarkCharacter.bookmarks.filter(id => !ids.includes(id))
      })

      // remove bookmarkCharacters with no bookmarks
      await this.bookmarkCharacters.filter(e => e.bookmarks.length === 0).delete()
    })
  }

  addRelic(data: BookmarkableRelic) {
    return this.transactionWithFirestore([this.bookmarks, this.bookmarkCharacters], async() => {
      const dataToSave: RelicBookmark = {
        ...data,
        bookmarkedAt: new Date(),
      }

      // add bookmark
      const id = (await this.bookmarks.add(dataToSave)) as number

      // add bookmark id to bookmarkCharacters
      const characterId = toCharacterIdWithVariant(data.characterId, data.variant)
      const bookmarkCharacter = await this.bookmarkCharacters.get(characterId)
      if (bookmarkCharacter) {
        await this.bookmarkCharacters.update(characterId, {
          bookmarks: bookmarkCharacter.bookmarks.concat(id),
        })
      } else {
        await this.bookmarkCharacters.add({
          characterId,
          bookmarks: [id],
        })
      }
    })
  }
}
