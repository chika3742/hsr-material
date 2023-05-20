import {PurposeType, TargetType} from "~/types/strings"

export interface BookmarkableIngredientMeta {
  level: number
  targetId: string
  targetType: TargetType
}

export interface BookmarkableIngredient extends BookmarkableIngredientMeta {
  id: string
  quantity: number
  purposeType: Exclude<PurposeType, "exp">
}

export interface BookmarkableExp extends BookmarkableIngredientMeta {
  exp: number
  purposeType: PurposeType & "exp"
}

export type BookmarkableItem = BookmarkableIngredient | BookmarkableExp
