import type { Materials } from "~/types/data/src/materials"
import type { MaterialsMeta } from "~/types/data/src/materials-meta"

export const useMaterials = () => {
  const materials = inject<Materials>("data_materials")
  if (!materials) {
    throw new Error("Must be used within DataProvider")
  }
  return materials
}

export const useMaterialsMeta = () => {
  const materialsMeta = inject<MaterialsMeta>("data_materialsMeta")
  if (!materialsMeta) {
    throw new Error("Must be used within DataProvider")
  }
  return materialsMeta
}
