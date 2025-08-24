import { describe, expect, it, vi } from "vitest"
import { getMaterialIdFromIngredient } from "../../utils/get-material-id-from-ingredient"
import type { Ingredient } from "../../types/data/ingredient"

// Mock the materials data
vi.mock("~/assets/data/materials.yaml", () => ({
  default: [
    { id: "common-mat-1", groupId: "common-group", craftLevel: 1 },
    { id: "common-mat-2", groupId: "common-group", craftLevel: 2 },
    { id: "common-mat-3", groupId: "common-group", craftLevel: 3 },
    { id: "primary-mat-1", groupId: "primary-group", craftLevel: 1 },
    { id: "primary-mat-2", groupId: "primary-group", craftLevel: 2 },
  ]
}))

describe("getMaterialIdFromIngredient", () => {
  const mockMaterialDefs = {
    "common": "group:common-group",
    "primary": "group:primary-group", 
    "ascension": "id:ascension-material",
    "skills": "id:skill-material"
  }

  describe("ExpIngredient handling", () => {
    it("should throw error for ExpIngredient", () => {
      const ingredient: Ingredient = { exp: 1000 }
      
      expect(() => getMaterialIdFromIngredient(ingredient, mockMaterialDefs))
        .toThrow("ExpIngredient is unsupported in this function")
    })
  })

  describe("FixedIdIngredient handling", () => {
    it("should return fixedId for FixedIdIngredient", () => {
      const ingredient: Ingredient = { 
        fixedId: "fixed-material-id", 
        quantity: 5 
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBe("fixed-material-id")
    })
  })

  describe("Character override handling", () => {
    it("should return override material when characterId matches", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 2,
        overrides: {
          "special-character": "special-material-id"
        }
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs, "special-character")
      expect(result).toBe("special-material-id")
    })

    it("should use normal flow when characterId doesn't match override", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 2,
        overrides: {
          "other-character": "special-material-id"
        }
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs, "target-character")
      expect(result).toBe("common-mat-2")
    })

    it("should use normal flow when no characterId provided", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 2,
        overrides: {
          "special-character": "special-material-id"
        }
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBe("common-mat-2")
    })
  })

  describe("Material definition resolution", () => {
    it("should return null when material type not found in definitions", () => {
      const ingredient: Ingredient = {
        type: "unknown" as any,
        quantity: 5,
        craftLevel: 1
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBeNull()
    })

    it("should return direct ID for id-type definition", () => {
      const ingredient: Ingredient = {
        type: "ascension",
        quantity: 5
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBe("ascension-material")
    })

    it("should resolve group material with craft level", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 1
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBe("common-mat-1")
    })

    it("should resolve different craft levels correctly", () => {
      const ingredient: Ingredient = {
        type: "primary",
        quantity: 8,
        craftLevel: 2
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBe("primary-mat-2")
    })

    it("should throw error when group material not found", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 999 // Non-existent craft level
      }
      
      expect(() => getMaterialIdFromIngredient(ingredient, mockMaterialDefs))
        .toThrow("Material not found for group common-group and craft level 999")
    })

    it("should throw error for invalid definition format", () => {
      const invalidDefs = {
        "invalid": "invalid-format"
      }
      
      const ingredient: Ingredient = {
        type: "invalid" as any,
        quantity: 5
      }
      
      expect(() => getMaterialIdFromIngredient(ingredient, invalidDefs))
        .toThrow("Parsing def error")
    })

    it("should throw error for group definition without craftLevel", () => {
      const ingredient: Ingredient = {
        type: "ascension",
        quantity: 5
        // Missing craftLevel for group type
      }
      
      const groupDefs = {
        "ascension": "group:some-group"
      }
      
      expect(() => getMaterialIdFromIngredient(ingredient, groupDefs))
        .toThrow("Parsing def error")
    })
  })

  describe("Edge cases", () => {
    it("should handle empty overrides object", () => {
      const ingredient: Ingredient = {
        type: "common",
        quantity: 10,
        craftLevel: 1,
        overrides: {}
      }
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs, "any-character")
      expect(result).toBe("common-mat-1")
    })

    it("should handle undefined type in TypedIngredient", () => {
      const ingredient = {
        type: undefined,
        quantity: 5
      } as any
      
      const result = getMaterialIdFromIngredient(ingredient, mockMaterialDefs)
      expect(result).toBeNull()
    })
  })
})