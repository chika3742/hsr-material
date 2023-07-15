import {Timestamp} from "@firebase/firestore"
import {Warp} from "#shared/warp"
import {StoreDefinition} from "pinia"
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

export type SyncedConfig = typeof useConfigStore extends StoreDefinition<any, infer S> ?
  Pick<S, "warpsUrl" | "tpCount" | "tpBaseTime" | "warpsShowPityList" | "ownedCharacters"> : never

export const configStoreToSyncedConfig = (config: ReturnType<typeof useConfigStore>): SyncedConfig => ({
  warpsUrl: config.warpsUrl,
  tpCount: config.tpCount,
  tpBaseTime: config.tpBaseTime,
  warpsShowPityList: config.warpsShowPityList,
  ownedCharacters: config.ownedCharacters,
})
