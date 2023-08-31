import {Bookmark} from "~/types/bookmark/bookmark"

export type BookmarkableCharacterMaterial = Omit<Bookmark.CharacterMaterial, "id" | "bookmarkedAt">

export type BookmarkableLightConeMaterial = Omit<Bookmark.LightConeMaterial, "id" | "bookmarkedAt">

export type BookmarkableExp = Omit<Bookmark.Exp, "id" | "bookmarkedAt" | "selectedItem">

export type BookmarkableMaterial = BookmarkableCharacterMaterial | BookmarkableLightConeMaterial

export type BookmarkableIngredient =
  | BookmarkableCharacterMaterial
  | BookmarkableLightConeMaterial
  | BookmarkableExp

export function isBookmarkableExp(item: BookmarkableIngredient): item is BookmarkableExp {
  return item.type === "character_exp" || item.type === "light_cone_exp"
}

export function isBookmarkableMaterial(item: BookmarkableIngredient): item is BookmarkableMaterial {
  return item.type === "character_material" || item.type === "light_cone_material"
}
