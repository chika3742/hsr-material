import { describe, expect, it } from "vitest"
import { splitByField } from "../../utils/split-by-field"

describe("splitByField", () => {
  it("should split empty array", () => {
    const result = splitByField([], "type")
    expect(result).toEqual([])
  })

  it("should handle single element", () => {
    const source = [{ id: 1, type: "A", value: 10 }]
    const result = splitByField(source, "type")
    expect(result).toEqual([[{ id: 1, type: "A", value: 10 }]])
  })

  it("should group elements by field", () => {
    const source = [
      { id: 1, type: "A", value: 10 },
      { id: 2, type: "B", value: 20 },
      { id: 3, type: "A", value: 30 },
      { id: 4, type: "C", value: 40 },
      { id: 5, type: "B", value: 50 },
    ]
    const result = splitByField(source, "type")
    expect(result).toEqual([
      [
        { id: 1, type: "A", value: 10 },
        { id: 3, type: "A", value: 30 },
      ],
      [
        { id: 2, type: "B", value: 20 },
        { id: 5, type: "B", value: 50 },
      ],
      [
        { id: 4, type: "C", value: 40 },
      ],
    ])
  })

  it("should maintain order of first occurrence", () => {
    const source = [
      { id: 1, category: "fruits" },
      { id: 2, category: "vegetables" },
      { id: 3, category: "fruits" },
      { id: 4, category: "meat" },
      { id: 5, category: "vegetables" },
    ]
    const result = splitByField(source, "category")
    expect(result).toEqual([
      [
        { id: 1, category: "fruits" },
        { id: 3, category: "fruits" },
      ],
      [
        { id: 2, category: "vegetables" },
        { id: 5, category: "vegetables" },
      ],
      [
        { id: 4, category: "meat" },
      ],
    ])
  })

  it("should handle all same values", () => {
    const source = [
      { id: 1, type: "same" },
      { id: 2, type: "same" },
      { id: 3, type: "same" },
    ]
    const result = splitByField(source, "type")
    expect(result).toEqual([
      [
        { id: 1, type: "same" },
        { id: 2, type: "same" },
        { id: 3, type: "same" },
      ],
    ])
  })

  it("should handle all different values", () => {
    const source = [
      { id: 1, type: "A" },
      { id: 2, type: "B" },
      { id: 3, type: "C" },
    ]
    const result = splitByField(source, "type")
    expect(result).toEqual([
      [{ id: 1, type: "A" }],
      [{ id: 2, type: "B" }],
      [{ id: 3, type: "C" }],
    ])
  })

  it("should work with numeric field values", () => {
    const source = [
      { id: 1, priority: 1 },
      { id: 2, priority: 2 },
      { id: 3, priority: 1 },
      { id: 4, priority: 3 },
      { id: 5, priority: 2 },
    ]
    const result = splitByField(source, "priority")
    expect(result).toEqual([
      [
        { id: 1, priority: 1 },
        { id: 3, priority: 1 },
      ],
      [
        { id: 2, priority: 2 },
        { id: 5, priority: 2 },
      ],
      [
        { id: 4, priority: 3 },
      ],
    ])
  })

  it("should work with boolean field values", () => {
    const source = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
      { id: 4, active: false },
    ]
    const result = splitByField(source, "active")
    expect(result).toEqual([
      [
        { id: 1, active: true },
        { id: 3, active: true },
      ],
      [
        { id: 2, active: false },
        { id: 4, active: false },
      ],
    ])
  })
})
