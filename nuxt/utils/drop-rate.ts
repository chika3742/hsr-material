import dropRates from "assets/data/drop-rates.yaml"
import materials from "~/assets/data/materials.csv"
import {useConfigStore} from "~/store/config"

// TODO: 詳細ダイアログを開いた際に何故か異様に重い。スロットリングを起こしている箇所の特定要。
export const getDropRateForMaterial = (id: string) => {
  const el = useConfigStore().equilibriumLevel

  const material = materials.find(e => e.id === id)
  if (!material) {
    throw new Error(`Material ${id} not found.`)
  }

  const entry = dropRates.find(e => e.ids?.includes(id) || e.type === material.category)
  if (!entry) {
    return null
  }

  const rarities = entry.drops.find(e => e.equilibriumLevels.includes(el))?.rarities
  if (!rarities) {
    return null
  }

  let rate = 0.0
  let factorProduct = 1

  for (const [rarity, dropCount] of Object.entries(rarities).reverse()) {
    if (Number(rarity) > material.rarity) {
      continue
    }

    factorProduct *= entry.craftFactors?.rarities[rarity] ?? 1

    rate += dropCount / factorProduct
  }

  return rate
}

export const getFarmingCount = (materialId: string, quantity: number) => {
  const dropRate = getDropRateForMaterial(materialId)
  if (!dropRate) {
    return null
  }

  return Math.ceil(quantity / dropRate)
}
