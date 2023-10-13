import dropRates from "assets/data/drop-rates.yaml"
import materials from "~/assets/data/materials.csv"
import {useConfigStore} from "~/store/config"

export const getDropRateForMaterial = (id: string) => {
  const el = useConfigStore().equilibriumLevel
  const material = materials.find(e => e.id === id)

  if (!material) {
    throw new Error(`Material ${id} not found.`)
  }

  for (const entry of dropRates) {
    if (entry.ids?.includes(id) || entry.type === material.category) {
      return entry.drops.find(e => e.equilibriumLevels.includes(el))?.rarities[material.rarity] ?? null
    }
  }

  return null
}

export const getFarmingCount = (materialId: string, quantity: number) => {
  const dropRate = getDropRateForMaterial(materialId)
  if (!dropRate) {
    return null
  }

  return Math.ceil(quantity / dropRate)
}
