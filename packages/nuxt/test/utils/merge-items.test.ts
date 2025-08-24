import { describe, expect, it, vi } from "vitest"
import { mergeItems, materialSortFunc } from "../../utils/merge-items"
import type { BookmarkableIngredient } from "../../types/bookmark/bookmarkables"

// Mock the materials data
vi.mock("~/assets/data/materials.yaml", () => ({
  default: [
    { id: "credit", groupId: null, craftLevel: null },
    { id: "material-a", groupId: "group-alpha", craftLevel: 1 },
    { id: "material-b", groupId: "group-alpha", craftLevel: 2 },
    { id: "material-c", groupId: "group-beta", craftLevel: 1 },
    { id: "material-d", groupId: "group-beta", craftLevel: 2 },
    { id: "material-no-group", groupId: null, craftLevel: null },
    { id: "a-material", groupId: null, craftLevel: null },
    { id: "z-material", groupId: null, craftLevel: null },
  ],
}))

describe("mergeItems", () => {
  const createExpItem = (exp: number): BookmarkableIngredient => ({
    type: "character_exp" as const,
    characterId: "test-character",
    exp,
    usage: {
      type: "exp" as const,
      lightConeId: null,
      purposeType: "ascension" as const,
      upperLevel: 80,
    },
    bookmarkedAt: "2025-01-01T00:00:00.000Z",
    selectedItem: "travelers-guide",
  } as any)

  const createMaterialItem = (materialId: string, quantity: number): BookmarkableIngredient => ({
    type: "character_material" as const,
    characterId: "test-character",
    materialId,
    quantity,
    usage: {
      type: "character" as const,
      purposeType: "ascension" as const,
      upperLevel: 80,
    },
    bookmarkedAt: "2025-01-01T00:00:00.000Z",
  } as any)

  it("should return empty array for empty input", () => {
    const result = mergeItems([])
    expect(result).toEqual([])
  })

  it("should group exp items together", () => {
    const items = [
      createExpItem(1000),
      createMaterialItem("material-a", 5),
      createExpItem(2000),
    ]

    const result = mergeItems(items)

    expect(result).toHaveLength(2)
    // First group should be exp items
    expect(result[0]).toHaveLength(2)
    expect(result[0][0].type).toBe("character_exp")
    expect(result[0][1].type).toBe("character_exp")

    // Second group should be material item
    expect(result[1]).toHaveLength(1)
    expect(result[1][0].type).toBe("character_material")
  })

  it("should group materials with same materialId", () => {
    const items = [
      createMaterialItem("material-a", 5),
      createMaterialItem("material-b", 10),
      createMaterialItem("material-a", 3),
    ]

    const result = mergeItems(items)

    expect(result).toHaveLength(2)

    // Find material-a group
    const materialAGroup = result.find(group =>
      group[0].type === "character_material"
      && (group[0] as any).materialId === "material-a",
    )
    expect(materialAGroup).toHaveLength(2)

    // Find material-b group
    const materialBGroup = result.find(group =>
      group[0].type === "character_material"
      && (group[0] as any).materialId === "material-b",
    )
    expect(materialBGroup).toHaveLength(1)
  })

  it("should handle mixed exp and material items correctly", () => {
    const items = [
      createMaterialItem("material-a", 5),
      createExpItem(1000),
      createMaterialItem("material-a", 3),
      createExpItem(2000),
      createMaterialItem("material-b", 10),
    ]

    const result = mergeItems(items)

    expect(result).toHaveLength(3)

    // Exp items should be first due to sorting
    expect(result[0][0].type).toBe("character_exp")
    expect(result[0]).toHaveLength(2)
  })
})

describe("materialSortFunc", () => {
  const createExpItem = (exp: number): BookmarkableIngredient => ({
    type: "character_exp" as const,
    characterId: "test-character",
    exp,
    usage: {
      type: "exp" as const,
      lightConeId: null,
      purposeType: "ascension" as const,
      upperLevel: 80,
    },
    bookmarkedAt: "2025-01-01T00:00:00.000Z",
    selectedItem: "travelers-guide",
  } as any)

  const createMaterialItem = (materialId: string): BookmarkableIngredient => ({
    type: "character_material" as const,
    characterId: "test-character",
    materialId,
    quantity: 10,
    usage: {
      type: "character" as const,
      purposeType: "ascension" as const,
      upperLevel: 80,
    },
    bookmarkedAt: "2025-01-01T00:00:00.000Z",
  } as any)

  it("should prioritize exp items", () => {
    const expItem = createExpItem(1000)
    const materialItem = createMaterialItem("material-a")

    expect(materialSortFunc(expItem, materialItem)).toBe(-1)
    expect(materialSortFunc(materialItem, expItem)).toBe(1)
  })

  it("should put credit items last", () => {
    const creditItem = createMaterialItem("credit")
    const regularItem = createMaterialItem("material-a")

    expect(materialSortFunc(creditItem, regularItem)).toBe(1)
    expect(materialSortFunc(regularItem, creditItem)).toBe(-1)
  })

  it("should sort exp items before credit items", () => {
    const expItem = createExpItem(1000)
    const creditItem = createMaterialItem("credit")

    expect(materialSortFunc(expItem, creditItem)).toBe(-1)
    expect(materialSortFunc(creditItem, expItem)).toBe(1)
  })

  it("should sort by groupId alphabetically", () => {
    const alphaItem = createMaterialItem("material-a") // group-alpha
    const betaItem = createMaterialItem("material-c") // group-beta

    expect(materialSortFunc(alphaItem, betaItem)).toBe(-1)
    expect(materialSortFunc(betaItem, alphaItem)).toBe(1)
  })

  it("should sort by craftLevel descending within same group", () => {
    const level1Item = createMaterialItem("material-a") // group-alpha, level 1
    const level2Item = createMaterialItem("material-b") // group-alpha, level 2

    // Higher craft level should come first (level 2 before level 1)
    expect(materialSortFunc(level2Item, level1Item)).toBe(-1)
    expect(materialSortFunc(level1Item, level2Item)).toBe(1)
  })

  it("should prioritize grouped materials over non-grouped", () => {
    const groupedItem = createMaterialItem("material-a") // has groupId
    const nonGroupedItem = createMaterialItem("material-no-group") // no groupId

    expect(materialSortFunc(groupedItem, nonGroupedItem)).toBe(-1)
    expect(materialSortFunc(nonGroupedItem, groupedItem)).toBe(1)
  })

  it("should sort non-grouped materials by materialId alphabetically", () => {
    const itemA = createMaterialItem("a-material")
    const itemZ = createMaterialItem("z-material")

    expect(materialSortFunc(itemA, itemZ)).toBe(-1)
    expect(materialSortFunc(itemZ, itemA)).toBe(1)
  })

  it("should handle arrays correctly", () => {
    const expItemArray = [createExpItem(1000)]
    const materialItemArray = [createMaterialItem("material-a")]

    expect(materialSortFunc(expItemArray, materialItemArray)).toBe(-1)
    expect(materialSortFunc(materialItemArray, expItemArray)).toBe(1)
  })

  it("should handle mixed array and single item", () => {
    const expItemArray = [createExpItem(1000)]
    const materialItem = createMaterialItem("material-a")

    expect(materialSortFunc(expItemArray, materialItem)).toBe(-1)
    expect(materialSortFunc(materialItem, expItemArray)).toBe(1)
  })
})
