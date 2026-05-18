export interface WarpExportItem {
  id: string
  gachaType: string
  time: string
  name: string
  itemType: "キャラクター" | "光円錐"
  rankType: string
  /** Pity count for 4-star and 5-star items; absent for 3-star */
  pityCount?: number
}

export interface WarpExportBanner {
  type: string
  name: string
  warps: WarpExportItem[]
}

export interface WarpExport {
  /** ISO 8601 timestamp */
  exportedAt: string
  schemaVersion: 1
  banners: WarpExportBanner[]
}
