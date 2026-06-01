import type { Warp } from "#shared/warp"
import type { WarpExport, WarpExportBanner, WarpExportItem } from "~/types/warp-export"

interface BannerConfig {
  type: string
  title: string
}

function buildWarpExportItems(warps: Warp[]): WarpExportItem[] {
  return warps.map(warp => ({
    id: warp.id,
    gachaType: warp.gachaType,
    time: warp.time,
    name: warp.name,
    itemType: warp.itemType,
    rankType: warp.rankType,
  }))
}

export function buildWarpExport(
  groupedWarps: Record<string, Warp[]>,
  bannerConfigs: BannerConfig[],
  uid: string,
): WarpExport {
  const banners: WarpExportBanner[] = bannerConfigs.map((config) => {
    const warps = groupedWarps[config.type] ?? []

    return {
      type: config.type,
      name: config.title,
      warps: buildWarpExportItems(warps),
    }
  })

  return {
    exportedAt: new Date().toISOString(),
    schemaVersion: 2,
    uid,
    banners,
  }
}

export function downloadWarpExport(data: WarpExport): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const date = new Date().toISOString().slice(0, 10)
  const a = document.createElement("a")
  a.href = url
  a.download = `warp-history-${date}.json`
  a.click()

  URL.revokeObjectURL(url)
}
