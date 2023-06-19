import Dexie, {Table} from "dexie"
import {BookmarkCharacter} from "~/types/bookmark/bookmark-character"
import {Bookmark, LevelingBookmark} from "~/types/bookmark/bookmark"
import {
  BookmarkableCharacterMaterial,
  BookmarkableExp,
  BookmarkableIngredient,
  BookmarkableLightConeMaterial,
} from "~/types/bookmarkable-ingredient"
import {PurposeType} from "~/types/strings"
import {toCharacterIdWithVariant} from "~/utils/to-character-id-with-variant"

export class MySubClassedDexie extends Dexie {
  bookmarkCharacters!: Table<BookmarkCharacter>
  bookmarks!: Table<Bookmark>

  constructor() {
    super("hsr_material")
    this.version(1).stores({
      bookmarkCharacters: "characterId, *bookmarks",
      bookmarks: "++id, usage.characterId",
    })
  }

  getLevelingBookmarks(items: BookmarkableIngredient[], purposeTypes: PurposeType[]) {
    const firstItem = items[0]
    return db.bookmarks.where("usage.characterId").equals(firstItem.usage.characterId)
      .and((e) => {
        if (e.type !== firstItem.type || e.usage.variant !== firstItem.usage.variant) {
          return false
        }

        switch (e.type) {
          case "exp": {
            const item = firstItem as BookmarkableExp // e.type and firstItem.type are the same
            return e.usage.lightConeId === item.usage.lightConeId
          }
          case "character_material": {
            const item = firstItem as BookmarkableCharacterMaterial // e.type and firstItem.type are the same
            return e.materialId === item.materialId && purposeTypes.includes(e.usage.purposeType)
          }
          case "light_cone_material": {
            const item = firstItem as BookmarkableLightConeMaterial // e.type and firstItem.type are the same
            return e.materialId === item.materialId && e.usage.lightConeId === item.usage.lightConeId
          }
        }
      }).toArray() as Promise<LevelingBookmark[]>
  }

  async addLevelingBookmarks<T extends BookmarkableIngredient>(data: T[], selectedItem: T extends BookmarkableExp ? string : undefined) {
    const saveData: LevelingBookmark[] = data.map((e) => {
      if (e.type === "exp") {
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

    const ids = (await this.bookmarks.bulkAdd(saveData, {allKeys: true})) as number[]

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
  }

  async removeLevelingBookmarks(ids: number[]) {
    await this.bookmarks.bulkDelete(ids)

    await this.bookmarkCharacters.where("bookmarks").anyOf(ids).modify((bookmarkCharacter) => {
      bookmarkCharacter.bookmarks = bookmarkCharacter.bookmarks.filter(id => !ids.includes(id))
    })
  }
}

export const db = new MySubClassedDexie()
