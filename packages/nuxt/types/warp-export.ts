export interface WarpExportItem {
  id: string
  gachaType: string
  time: string
  name: string
  itemType: "キャラクター" | "光円錐"
  rankType: string
}

export interface WarpExportBanner {
  type: string
  name: string
  warps: WarpExportItem[]
}

export interface WarpExport {
  /** ISO 8601 timestamp */
  exportedAt: string
  schemaVersion: 2
  /** Player UID */
  uid: string
  banners: WarpExportBanner[]
}
