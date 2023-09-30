import {Timestamp} from "@firebase/firestore"
import {Warp} from "#shared/warp"
import {Bookmark} from "~/types/bookmark/bookmark"
import {useConfigStore} from "~/store/config"

export interface UserDocument {
  schemaVersion: number
  savedAt: Timestamp
  data: SyncedUserData
  config: SyncedConfig
}

export interface SyncedUserData {
  bookmarks: Bookmark[]
  warps: Warp[]
}

export type SyncedConfig = Pick<ReturnType<typeof useConfigStore>,
    | "warpsUrl"
    | "tpCount"
    | "tpBaseTime"
    | "warpsShowPityList"
    | "ownedCharacters"
    | "characterOrder"
>

export const configStoreToSyncedConfig = (config: ReturnType<typeof useConfigStore>): SyncedConfig => ({
  warpsUrl: config.warpsUrl,
  tpCount: config.tpCount,
  tpBaseTime: config.tpBaseTime,
  warpsShowPityList: config.warpsShowPityList,
  ownedCharacters: config.ownedCharacters,
  characterOrder: config.characterOrder,
})
