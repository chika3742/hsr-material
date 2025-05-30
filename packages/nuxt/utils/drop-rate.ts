import dropRates from "assets/data/drop-rates.yaml"
import materials from "~/assets/data/materials.yaml"

export const getDropRateForMaterial = (id: string): { rate: number, isChallengeableConsecutively: boolean } | null => {
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

  if (rate === 0) {
    return null
  }

  return {
    rate,
    isChallengeableConsecutively: entry.isChallengeableConsecutively,
  }
}

export const getFarmingCount = (materialId: string, quantity: number) => {
  const dropRate = getDropRateForMaterial(materialId)
  if (!dropRate) {
    return null
  }

  return Math.ceil(quantity / dropRate.rate)
}
