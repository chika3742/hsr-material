import { describe, expect, it } from "vitest"
import {
  toCharacterIdWithVariant,
  toCharacterId,
  toVariant,
} from "../../utils/to-character-id-with-variant"

describe("toCharacterIdWithVariant", () => {
  it("should return characterId when variant is null", () => {
    const result = toCharacterIdWithVariant("trailblazer", null)
    expect(result).toBe("trailblazer")
  })

  it("should return characterId_variant when variant is provided", () => {
    const result = toCharacterIdWithVariant("trailblazer", "destruction")
    expect(result).toBe("trailblazer_destruction")
  })

  it("should handle empty string variant as null", () => {
    const result = toCharacterIdWithVariant("march-7th", "")
    expect(result).toBe("march-7th")
  })

  it("should handle complex character IDs", () => {
    const result = toCharacterIdWithVariant("march-7th", "preservation")
    expect(result).toBe("march-7th_preservation")
  })
})

describe("toCharacterId", () => {
  it("should extract characterId from simple characterIdWithVariant", () => {
    const result = toCharacterId("trailblazer")
    expect(result).toBe("trailblazer")
  })

  it("should extract characterId from characterIdWithVariant with variant", () => {
    const result = toCharacterId("trailblazer_destruction")
    expect(result).toBe("trailblazer")
  })

  it("should handle character IDs with hyphens", () => {
    const result = toCharacterId("march-7th_preservation")
    expect(result).toBe("march-7th")
  })

  it("should handle multiple underscores correctly", () => {
    const result = toCharacterId("character_with_multiple_underscores")
    expect(result).toBe("character")
  })
})

describe("toVariant", () => {
  it("should return null for simple characterId without variant", () => {
    const result = toVariant("trailblazer")
    expect(result).toBeNull()
  })

  it("should extract variant from characterIdWithVariant", () => {
    const result = toVariant("trailblazer_destruction")
    expect(result).toBe("destruction")
  })

  it("should handle character IDs with hyphens", () => {
    const result = toVariant("march-7th_preservation")
    expect(result).toBe("preservation")
  })

  it("should handle multiple underscores correctly", () => {
    const result = toVariant("character_with_multiple_underscores")
    expect(result).toBe("with_multiple_underscores")
  })

  it("should handle variant with underscores", () => {
    const result = toVariant("trailblazer_the_hunt")
    expect(result).toBe("the_hunt")
  })

  it("should return null for empty variant", () => {
    const result = toVariant("character_")
    expect(result).toBeNull()
  })
})
