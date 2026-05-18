import type { Warp } from "#shared/warp"
import type { WarpExport, WarpExportBanner, WarpExportItem } from "~/types/warp-export"

interface BannerConfig {
  type: string
  title: string
}

function buildWarpExportItems(warps: Warp[]): WarpExportItem[] {
  const items: WarpExportItem[] = []
  const pityCount: Record<string, number> = { 4: 0, 5: 0 }

  for (const warp of warps) {
    pityCount[4]++
    pityCount[5]++

    const item: WarpExportItem = {
      id: warp.id,
      gachaType: warp.gachaType,
      time: warp.time,
      name: warp.name,
      itemType: warp.itemType,
      rankType: warp.rankType,
    }

    if (warp.rankType === "4" || warp.rankType === "5") {
      item.pityCount = pityCount[warp.rankType]
      pityCount[warp.rankType] = 0
    }

    items.push(item)
  }

  return items
}

export function buildWarpExport(
  groupedWarps: Record<string, Warp[]>,
  bannerConfigs: BannerConfig[],
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
    schemaVersion: 1,
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
