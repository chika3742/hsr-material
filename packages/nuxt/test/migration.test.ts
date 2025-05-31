import { describe, expect, it } from "vitest"
import { migrate } from "../dexie/migrate"

describe("Migration", () => {
  it("should migrate from v4 to v5", () => {
    // T: trailblazer, M: march-7th
    // [(T_destruction, exp), (T_preservation, exp), (M_preservation, exp), (M_the_hunt, material)]
    // => [(T, exp), (M, exp), (M, material)]
    const data = {
      bookmarks: [
        { // unrelated bookmark (should be unaffected)
          type: "character_exp",
          characterId: "dan-heng",
          exp: 2763000,
          usage: {
            type: "exp",
            lightConeId: null,
            purposeType: "ascension",
            upperLevel: 80,
          },
          bookmarkedAt: "2025-01-01T00:00:00.000Z",
          selectedItem: "travelers-guide",
          hash: "17584663ffc959f31f9f31b997c2153914c95ace",
          id: 10,
        },
        {
          type: "character_exp",
          characterId: "trailblazer_destruction",
          exp: 2763000,
          usage: {
            type: "exp",
            lightConeId: null,
            purposeType: "ascension",
            upperLevel: 80,
          },
          bookmarkedAt: "2025-01-01T00:00:00.000Z",
          selectedItem: "travelers-guide",
          hash: "6912039ded8169a59fc752d93dc7e70433f7d847",
          id: 1,
        },
        {
          type: "character_exp",
          characterId: "trailblazer_preservation",
          exp: 2763000,
          usage: {
            type: "exp",
            lightConeId: null,
            purposeType: "ascension",
            upperLevel: 80,
          },
          bookmarkedAt: "2025-01-01T00:00:00.000Z",
          selectedItem: "travelers-guide",
          hash: "a8fb0f85235e0c4c504b1c63fb8f45015ee6a89d",
          id: 2,
        },
        {
          type: "character_exp",
          characterId: "march-7th_preservation",
          exp: 2763000,
          usage: {
            type: "exp",
            lightConeId: null,
            purposeType: "ascension",
            upperLevel: 80,
          },
          bookmarkedAt: "2025-01-01T00:00:00.000Z",
          selectedItem: "travelers-guide",
          hash: "a6883c8dc6256f9deb898ea63721c9cd6c4a9404",
          id: 3,
        },
        {
          type: "character_material",
          characterId: "march-7th_the_hunt",
          materialId: "horn-of-snow",
          quantity: 28,
          usage: {
            type: "character",
            purposeType: "ascension",
            upperLevel: 80,
          },
          bookmarkedAt: "2025-01-01T00:00:00.000Z",
          hash: "16bf0f927670d3298e341bb21769e7894b21c2c3",
          id: 4,
        },
      ],
    }

    const migratedData = migrate(data, 4, 5)

    expect(migratedData.bookmarks).toEqual([
      {
        type: "character_exp",
        characterId: "dan-heng",
        exp: 2763000,
        usage: {
          type: "exp",
          lightConeId: null,
          purposeType: "ascension",
          upperLevel: 80,
        },
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        selectedItem: "travelers-guide",
        hash: "17584663ffc959f31f9f31b997c2153914c95ace",
        id: 10,
      },
      {
        type: "character_exp",
        characterId: "trailblazer",
        exp: 2763000,
        usage: {
          type: "exp",
          lightConeId: null,
          purposeType: "ascension",
          upperLevel: 80,
        },
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        selectedItem: "travelers-guide",
        hash: "aafc32857b94583f787574cb53b945689e3b4989",
        id: 1,
      },
      {
        type: "character_exp",
        characterId: "march-7th",
        exp: 2763000,
        usage: {
          type: "exp",
          lightConeId: null,
          purposeType: "ascension",
          upperLevel: 80,
        },
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        selectedItem: "travelers-guide",
        hash: "effbc2669e349080a9568f64a30c3bd94dab5c2b",
        id: 3,
      },
      {
        type: "character_material",
        characterId: "march-7th",
        materialId: "horn-of-snow",
        quantity: 28,
        usage: {
          type: "character",
          purposeType: "ascension",
          upperLevel: 80,
        },
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        hash: "4b7ea23f461adb2a6f476c4bc1e19ab3d5d38074",
        id: 4,
      },
    ])
  })
})
