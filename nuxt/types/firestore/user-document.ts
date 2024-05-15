import type {Timestamp} from "@firebase/firestore"
import type {Warp} from "#shared/warp"
import type {Bookmark} from "~/types/bookmark/bookmark"

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

export const configStoreToSyncedConfig = (config: ReturnType<typeof useConfigStore>) => ({
  warpsUrl: config.warpsUrl,
  tpCount: config.tpCount,
  tpBaseTime: config.tpBaseTime,
  warpsShowPityList: config.warpsShowPityList,
  ownedCharacters: config.ownedCharacters,
  characterOrder: config.characterOrder,
  showFarmingCount: config.showFarmingCount,
  equilibriumLevel: config.equilibriumLevel,
})

export type SyncedConfig = ReturnType<typeof configStoreToSyncedConfig>
